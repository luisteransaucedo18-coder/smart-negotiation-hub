import React, { useEffect, useMemo, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, Alert, Keyboard, KeyboardAvoidingView, LogBox, Platform, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import AppHeader from "./components/AppHeader";
import AppNavigationBar from "./components/AppNavigationBar";
import LocationPicker from "./components/LocationPicker";
import AuthScreen from "./screens/AuthScreen";
import PassengerHomeScreen from "./screens/PassengerHomeScreen";
import WaitingOffersScreen from "./screens/WaitingOffersScreen";
import DriverHomeScreen from "./screens/DriverHomeScreen";
import ActiveTripScreen from "./screens/ActiveTripScreen";
import RatingScreen from "./screens/RatingScreen";
import ProfileScreen from "./screens/ProfileScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import { sharedStyles } from "./theme/sharedStyles";
import { colors } from "./theme/colors";
import { AuthMode, ChatMessage, DriverProfile, LocationTarget, Offer, RideRequest, Role, RoutePoint, ScreenName, Trip, UserProfile } from "./types";
import { getErrorMessage } from "./services/errorService";
import { getUserProfile, loginUser, logoutUser, registerUser } from "./services/authService";
import { calculatePriceRange, calculateSuggestedPrice, toNumber } from "./services/pricingService";
import { calculateDistanceKm } from "./services/distanceService";
import { validateLoginForm, validatePrice, validateRegisterForm } from "./services/validationService";
import { DEFAULT_DESTINATION, DEFAULT_ORIGIN, cancelRideByDriverSimulated, createRideRequest, listenPendingRides, listenPassengerPendingRide } from "./services/rideService";
import { createOffer, listenOffersByRide } from "./services/offerService";
import { acceptOfferAndCreateTrip, listenDriverActiveTrip, listenPassengerActiveTrip, listenTrip, resolveEmergency, updateTripStatus } from "./services/tripService";
import { applySimulatedPenalty, listenDriverProfile } from "./services/driverService";
import { createEmergencyAlert } from "./services/emergencyService";
import { submitTripRating } from "./services/ratingService";
import { shareRouteSimulated } from "./services/shareService";
import { listenTripMessages, sendQuickMessage, sendTripMessage } from "./services/messageService";
import { getCurrentRoutePoint } from "./services/locationService";

LogBox.ignoreLogs([
  "props.pointerEvents is deprecated. Use style.pointerEvents",
]);

const ONBOARDING_STORAGE_KEY = "smartHub:onboardingSeen:v2";

export default function SmartHubApp() {
  const { width, height } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [authError, setAuthError] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const registeringRef = useRef(false);
  const [screen, setScreen] = useState<ScreenName>("auth");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(null);
  const [driverActiveTrip, setDriverActiveTrip] = useState<Trip | null>(null);

  const [name, setName] = useState("Luis Teran");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("passenger");
  const [vehicle, setVehicle] = useState("Toyota Yaris");
  const [vehicleColor, setVehicleColor] = useState("Blanco");
  const [plate, setPlate] = useState("ABC-123");
  const [licenseNumber, setLicenseNumber] = useState("LIC123456");
  const [emergencyContactName, setEmergencyContactName] = useState("Marta Teran");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("999888777");
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState("Madre");

  const [originPoint, setOriginPoint] = useState<RoutePoint>(DEFAULT_ORIGIN);
  const [destinationPoint, setDestinationPoint] = useState<RoutePoint>(DEFAULT_DESTINATION);
  const [locationTarget, setLocationTarget] = useState<LocationTarget>("origin");
  const [isPeakHour, setIsPeakHour] = useState(true);
  const [safeNightMode, setSafeNightMode] = useState(false);
  const [quietMode, setQuietMode] = useState(false);
  const [passengerNote, setPassengerNote] = useState("");
  const [passengerPrice, setPassengerPrice] = useState("12");

  const [pendingRides, setPendingRides] = useState<RideRequest[]>([]);
  const [currentRide, setCurrentRide] = useState<RideRequest | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [driverOfferPrice, setDriverOfferPrice] = useState("12.50");
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [currentTripId, setCurrentTripId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatDraft, setChatDraft] = useState("");
  const [rating, setRating] = useState(5);
  const [ratingComment, setRatingComment] = useState("");

  const distanceKmNumber = useMemo(() => calculateDistanceKm(originPoint.latitude, originPoint.longitude, destinationPoint.latitude, destinationPoint.longitude), [originPoint, destinationPoint]);
  const distanceKm = useMemo(() => distanceKmNumber.toFixed(2), [distanceKmNumber]);
  const suggestedPrice = useMemo(() => calculateSuggestedPrice(distanceKmNumber, isPeakHour, safeNightMode), [distanceKmNumber, isPeakHour, safeNightMode]);
  const priceRange = useMemo(() => calculatePriceRange(suggestedPrice), [suggestedPrice]);

  useEffect(() => { setPassengerPrice(suggestedPrice.toFixed(2)); }, [suggestedPrice]);

  useEffect(() => {
    let mounted = true;
    async function hydrateCurrentLocation() {
      const currentPoint = await getCurrentRoutePoint();
      if (!mounted || !currentPoint) return;
      setOriginPoint(currentPoint);
    }
    hydrateCurrentLocation();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadOnboardingState() {
      try {
        if (mounted) setShowOnboarding(true);
      } finally {
        if (mounted) setCheckingOnboarding(false);
      }
    }
    loadOnboardingState();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (registeringRef.current) return;
        setLoading(true);
        if (!firebaseUser) { resetSession(); return; }
        const loadedProfile = await getUserProfile(firebaseUser.uid);
        setProfile(loadedProfile);
        setScreen(loadedProfile.role === "driver" ? "driverHome" : "passengerHome");
      } catch (error) {
        Alert.alert("Error", getErrorMessage(error));
      } finally { setLoading(false); }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (profile?.role !== "driver") { setPendingRides([]); return; }
    return listenPendingRides(setPendingRides);
  }, [profile?.role]);

  useEffect(() => {
    if (!currentRide || screen !== "waitingOffers") return;
    return listenOffersByRide(currentRide.id, setOffers);
  }, [currentRide, screen]);

  useEffect(() => {
    if (profile?.role !== "passenger") return;
    return listenPassengerActiveTrip(profile.id, (trip) => {
      if (!trip) return;
      setActiveTrip(trip); setCurrentTripId(trip.id); setCurrentRide(null); setOffers([]);
      setScreen(trip.status === "completed" ? "rating" : "activeTrip");
    });
  }, [profile?.id, profile?.role]);

  useEffect(() => {
    if (profile?.role !== "passenger") return;
    if (screen === "activeTrip" || screen === "rating" || screen === "locationPicker") return;
    return listenPassengerPendingRide(profile.id, (ride) => {
      if (!ride) return;
      setCurrentRide(ride); setScreen("waitingOffers");
    });
  }, [profile?.id, profile?.role, screen]);

  useEffect(() => { if (!currentTripId) return; return listenTrip(currentTripId, setActiveTrip); }, [currentTripId]);
  useEffect(() => {
    if (!currentTripId) { setChatMessages([]); return; }
    setChatMessages((current) => current.length ? current : createInitialChatMessages(currentTripId, profile));
    return listenTripMessages(currentTripId, (messages) => {
      setChatMessages((current) => mergeMessages(current.filter((message) => message.localOnly), messages));
    });
  }, [currentTripId, profile]);
  useEffect(() => { if (profile?.role !== "driver") { setDriverProfile(null); return; } return listenDriverProfile(profile.id, setDriverProfile); }, [profile?.id, profile?.role]);
  useEffect(() => { if (profile?.role !== "driver") { setDriverActiveTrip(null); return; } return listenDriverActiveTrip(profile.id, setDriverActiveTrip); }, [profile?.id, profile?.role]);

  function resetSession() {
    setProfile(null); setDriverProfile(null); setDriverActiveTrip(null); setCurrentRide(null); setCurrentTripId(null); setActiveTrip(null); setOffers([]); setChatMessages([]); setChatDraft(""); setAuthMode("login"); setScreen("auth");
  }

  async function handleRegister() {
    try {
      setSaving(true);
      setAuthError("");
      registeringRef.current = true;
      const cleanName = name.trim(); const cleanDni = dni.trim(); const cleanEmail = email.trim().toLowerCase(); const cleanVehicle = vehicle.trim(); const cleanColor = vehicleColor.trim(); const cleanPlate = plate.trim().toUpperCase(); const cleanLicense = licenseNumber.trim().toUpperCase();
      const validationMessage = validateRegisterForm({ name: cleanName, dni: cleanDni, email: cleanEmail, password, role, vehicle: cleanVehicle, vehicleColor: cleanColor, plate: cleanPlate, licenseNumber: cleanLicense, emergencyContactName, emergencyContactPhone, emergencyContactRelationship });
      if (validationMessage) { Alert.alert("Revisa el formulario", validationMessage); return; }
      const newProfile = await registerUser({ name: cleanName, dni: cleanDni, email: cleanEmail, password, role, vehicle: cleanVehicle, vehicleColor: cleanColor, plate: cleanPlate, licenseNumber: cleanLicense, emergencyContactName: emergencyContactName.trim(), emergencyContactPhone: emergencyContactPhone.trim(), emergencyContactRelationship: emergencyContactRelationship.trim() });
      setProfile(newProfile); setScreen(newProfile.role === "driver" ? "driverHome" : "passengerHome");
      Alert.alert("Cuenta creada", "Tu cuenta fue creada correctamente.");
    } catch (error) { const message = getErrorMessage(error); setAuthError(message); Alert.alert("Error al registrar", message); } finally { registeringRef.current = false; setSaving(false); }
  }

  async function handleLogin() {
    try {
      setAuthError("");
      setSaving(true); const cleanEmail = email.trim().toLowerCase();
      const validationMessage = validateLoginForm(cleanEmail, password);
      if (validationMessage) { setAuthError(validationMessage); Alert.alert("Revisa tus datos", validationMessage); return; }
      const loadedProfile = await loginUser(cleanEmail, password, role, { name: name.trim(), dni: dni.trim(), email: cleanEmail, role, vehicle: vehicle.trim(), vehicleColor: vehicleColor.trim(), plate: plate.trim().toUpperCase(), licenseNumber: licenseNumber.trim().toUpperCase(), emergencyContactName: emergencyContactName.trim(), emergencyContactPhone: emergencyContactPhone.trim(), emergencyContactRelationship: emergencyContactRelationship.trim() });
      setProfile(loadedProfile); setScreen(loadedProfile.role === "driver" ? "driverHome" : "passengerHome");
    } catch (error) { const message = getErrorMessage(error); setAuthError(message); Alert.alert("Error al iniciar sesion", message); } finally { setSaving(false); }
  }

  async function handleLogout() { await logoutUser(); resetSession(); }

  async function handleCompleteOnboarding() {
    try {
      setSaving(true);
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    } catch {
      Alert.alert("Modo local", "No se pudo guardar la bienvenida, pero puedes continuar usando la app.");
    } finally {
      setShowOnboarding(false);
      setSaving(false);
    }
  }

  async function handleCreateRide() {
    try {
      if (!profile) return; setSaving(true);
      const proposed = toNumber(passengerPrice, suggestedPrice);
      const validationMessage = validatePrice(proposed, priceRange.min, priceRange.max);
      if (validationMessage) { Alert.alert("Revisa la tarifa", validationMessage); return; }
      const ride = await createRideRequest({ profile, originName: originPoint.name, destinationName: destinationPoint.name, distanceKm: distanceKmNumber, suggestedPrice, minRecommendedPrice: priceRange.min, maxRecommendedPrice: priceRange.max, passengerPrice: proposed, originLat: originPoint.latitude, originLng: originPoint.longitude, destinationLat: destinationPoint.latitude, destinationLng: destinationPoint.longitude, safeNightMode, quietMode, passengerNote: passengerNote.trim() });
      setCurrentRide(ride); setOffers([]); setScreen("waitingOffers");
    } catch (error) { Alert.alert("Error al solicitar viaje", getErrorMessage(error)); } finally { setSaving(false); }
  }

  async function handleSendOffer(ride: RideRequest, price?: number) {
    try {
      if (!driverProfile) { Alert.alert("Perfil incompleto", "No se encontro el perfil del conductor."); return; }
      setSaving(true); const offerPrice = price ?? toNumber(driverOfferPrice, ride.passengerPrice);
      const validationMessage = validatePrice(offerPrice, ride.minRecommendedPrice, ride.maxRecommendedPrice);
      if (validationMessage && !price) { Alert.alert("Revisa tu oferta", validationMessage); return; }
      await createOffer({ ride, driver: driverProfile, offeredPrice: offerPrice });
      Alert.alert("Oferta enviada", "El pasajero vera tu oferta en tiempo real.");
    } catch (error) { Alert.alert("Error al enviar oferta", getErrorMessage(error)); } finally { setSaving(false); }
  }

  async function handleAcceptOffer(offer: Offer) {
    try {
      if (!profile || !currentRide) return; setSaving(true);
      const trip = await acceptOfferAndCreateTrip({ profile, ride: currentRide, offer });
      setCurrentTripId(trip.id); setActiveTrip(trip); setCurrentRide(null); setOffers([]); setScreen("activeTrip");
    } catch (error) { Alert.alert("Error al aceptar oferta", getErrorMessage(error)); } finally { setSaving(false); }
  }

  function updateActiveTripLocal(changes: Partial<Trip>) {
    setActiveTrip((current) => current ? { ...current, ...changes } : current);
    setDriverActiveTrip((current) => current ? { ...current, ...changes } : current);
  }

  function addLocalChatMessage(trip: Trip, actor: UserProfile, text: string) {
    const localMessage: ChatMessage = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      tripId: trip.id,
      fromUserId: actor.id,
      fromName: actor.name,
      fromRole: actor.role,
      text,
      createdAt: Date.now(),
      localOnly: true,
    };
    setChatMessages((current) => mergeMessages(current, [localMessage]));
  }

  async function handleEmergency() {
    try {
      if (!profile || !activeTrip) return;
      updateActiveTripLocal({ emergencyStatus: "active", lastEmergencyByRole: profile.role, lastEmergencyByName: profile.name });
      await createEmergencyAlert(activeTrip, profile);
      Alert.alert("Alerta registrada", "Se prepararon los datos criticos del viaje y el contacto de emergencia.");
    } catch (error) {
      Alert.alert("Modo demo activo", `${getErrorMessage(error)}\n\nLa alerta se mostro localmente para continuar la prueba.`);
    }
  }
  async function handleShareRoute() {
    try {
      if (!profile || !activeTrip) return;
      await shareRouteSimulated(activeTrip, profile);
      Alert.alert("Ruta compartida", "Se registro el envio de ruta al contacto de emergencia.");
    } catch (error) {
      Alert.alert("Modo demo activo", `${getErrorMessage(error)}\n\nLa accion se simulo localmente.`);
    }
  }
  async function handleQuickMessage(text: string) {
    try {
      if (!profile || !activeTrip) return;
      addLocalChatMessage(activeTrip, profile, text);
      await sendQuickMessage(activeTrip, profile, text);
      Alert.alert("Mensaje enviado", text);
    } catch (error) {
      Alert.alert("Modo demo activo", `${getErrorMessage(error)}\n\nMensaje simulado: ${text}`);
    }
  }
  async function handleSendChatMessage() {
    try {
      if (!profile || !activeTrip) return;
      const text = chatDraft.trim();
      if (!text) return;
      setChatDraft("");
      addLocalChatMessage(activeTrip, profile, text);
      await sendTripMessage(activeTrip, profile, text);
    } catch (error) {
      Alert.alert("Modo demo activo", `${getErrorMessage(error)}\n\nEl mensaje quedo visible localmente.`);
    }
  }
  async function handleStartTrip() {
    if (!activeTrip) return;
    updateActiveTripLocal({ status: "in_progress" });
    try { await updateTripStatus(activeTrip.id, "in_progress"); }
    catch (error) { Alert.alert("Modo demo activo", `${getErrorMessage(error)}\n\nEl viaje se inicio localmente.`); }
  }
  async function handleFinishTrip() {
    if (!activeTrip) return;
    updateActiveTripLocal({ status: "completed" });
    try { await updateTripStatus(activeTrip.id, "completed"); }
    catch (error) { Alert.alert("Modo demo activo", `${getErrorMessage(error)}\n\nEl viaje se finalizo localmente.`); }
  }
  async function handleResolveEmergency() {
    if (!activeTrip) return;
    updateActiveTripLocal({ emergencyStatus: "resolved" });
    try { await resolveEmergency(activeTrip.id); }
    catch (error) { Alert.alert("Modo demo activo", `${getErrorMessage(error)}\n\nLa alerta se resolvio localmente.`); }
  }

  async function handleSubmitRating() {
    try { if (!profile || !activeTrip) return; setSaving(true); await submitTripRating({ trip: activeTrip, profile, rating, comment: ratingComment }); Alert.alert("Calificacion enviada", "Gracias por evaluar este viaje."); setActiveTrip(null); setCurrentTripId(null); setRating(5); setRatingComment(""); setScreen("passengerHome"); }
    catch (error) { Alert.alert("Error al calificar", getErrorMessage(error)); } finally { setSaving(false); }
  }

  async function handleCancelRideByDriver(ride: RideRequest) {
    try { if (!driverProfile) return; await cancelRideByDriverSimulated(ride.id); await applySimulatedPenalty(driverProfile); Alert.alert("Cancelacion registrada", "Se actualizo el historial del conductor."); }
    catch (error) { Alert.alert("Error", getErrorMessage(error)); }
  }
  async function handlePenalty() { try { if (!driverProfile) return; await applySimulatedPenalty(driverProfile); Alert.alert("Penalizacion aplicada", "El puntaje de confianza fue actualizado."); } catch (error) { Alert.alert("Error", getErrorMessage(error)); } }

  const originPickerPoint = locationTarget === "origin" ? originPoint : destinationPoint;
  const navigationTrip = activeTrip || driverActiveTrip;
  const showNavigation = !!profile && screen !== "locationPicker";
  const isLoginScreen = screen === "auth" && authMode === "login";
  const compactDevice = width < 390 || height < 820;
  const lockLoginScroll = isLoginScreen && !keyboardVisible && !compactDevice;

  function handleNavigate(target: ScreenName) {
    if (!profile) return;
    if (target === "activeTrip") {
      if (!navigationTrip) return;
      setActiveTrip(navigationTrip);
      setCurrentTripId(navigationTrip.id);
      setScreen("activeTrip");
      return;
    }
    if (target === "waitingOffers") {
      if (!currentRide) return;
      setScreen("waitingOffers");
      return;
    }
    if (target === "driverHome" && profile.role !== "driver") return;
    if (target === "passengerHome" && profile.role !== "passenger") return;
    setScreen(target);
  }

  if (loading || checkingOnboarding) return <SafeAreaView style={sharedStyles.safeArea}><View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><ActivityIndicator size="large" color={colors.primary} /><Text style={{ marginTop: 12, color: colors.textMuted }}>Cargando SmartHub...</Text></View></SafeAreaView>;

  if (showOnboarding) return <SafeAreaView style={sharedStyles.safeArea}><OnboardingScreen onContinue={handleCompleteOnboarding} saving={saving} /></SafeAreaView>;

  return (
    <SafeAreaView style={sharedStyles.safeArea}>
      {screen === "locationPicker" ? (
        <LocationPicker target={locationTarget} initialPoint={originPickerPoint} onCancel={() => setScreen("passengerHome")} onSelect={(point: RoutePoint) => { if (locationTarget === "origin") setOriginPoint(point); else setDestinationPoint(point); setScreen("passengerHome"); }} />
      ) : (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? (isLoginScreen ? 18 : 72) : 0}>
        <ScrollView
          contentContainerStyle={[
            sharedStyles.container,
            compactDevice && { paddingHorizontal: 18 },
            isLoginScreen && !keyboardVisible && !compactDevice && { flexGrow: 1, justifyContent: "center", paddingTop: 8, paddingBottom: 24 },
            isLoginScreen && !keyboardVisible && compactDevice && { flexGrow: 1, justifyContent: "flex-start", paddingTop: 10, paddingBottom: 44 },
            isLoginScreen && keyboardVisible && { flexGrow: 1, justifyContent: "flex-start", paddingTop: 12, paddingBottom: 220 },
          ]}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={!lockLoginScroll}
          showsVerticalScrollIndicator={false}
        >
          {screen !== "auth" && <AppHeader profile={profile} onLogout={handleLogout} />}
          {screen === "auth" && <AuthScreen authMode={authMode} setAuthMode={setAuthMode} name={name} setName={setName} dni={dni} setDni={setDni} email={email} setEmail={setEmail} password={password} setPassword={setPassword} role={role} setRole={setRole} vehicle={vehicle} setVehicle={setVehicle} vehicleColor={vehicleColor} setVehicleColor={setVehicleColor} plate={plate} setPlate={setPlate} licenseNumber={licenseNumber} setLicenseNumber={setLicenseNumber} emergencyContactName={emergencyContactName} setEmergencyContactName={setEmergencyContactName} emergencyContactPhone={emergencyContactPhone} setEmergencyContactPhone={setEmergencyContactPhone} emergencyContactRelationship={emergencyContactRelationship} setEmergencyContactRelationship={setEmergencyContactRelationship} authError={authError} onSubmit={authMode === "register" ? handleRegister : handleLogin} onBack={() => setAuthMode("login")} saving={saving} keyboardVisible={keyboardVisible} />}
          {screen === "passengerHome" && <PassengerHomeScreen originPoint={originPoint} destinationPoint={destinationPoint} onPickOrigin={() => { setLocationTarget("origin"); setScreen("locationPicker"); }} onPickDestination={() => { setLocationTarget("destination"); setScreen("locationPicker"); }} distanceKm={distanceKm} suggestedPrice={suggestedPrice} minPrice={priceRange.min} maxPrice={priceRange.max} passengerPrice={passengerPrice} setPassengerPrice={setPassengerPrice} passengerNote={passengerNote} setPassengerNote={setPassengerNote} isPeakHour={isPeakHour} setIsPeakHour={setIsPeakHour} safeNightMode={safeNightMode} setSafeNightMode={setSafeNightMode} quietMode={quietMode} setQuietMode={setQuietMode} onCreateRide={handleCreateRide} saving={saving} />}
          {screen === "waitingOffers" && <WaitingOffersScreen ride={currentRide} offers={offers} onAcceptOffer={handleAcceptOffer} onBack={() => setScreen("passengerHome")} saving={saving} />}
          {screen === "driverHome" && <DriverHomeScreen driverProfile={driverProfile} pendingRides={pendingRides} driverActiveTrip={driverActiveTrip} driverOfferPrice={driverOfferPrice} setDriverOfferPrice={setDriverOfferPrice} onSendOffer={handleSendOffer} onCancelRide={handleCancelRideByDriver} onOpenActiveTrip={(trip) => { setActiveTrip(trip); setCurrentTripId(trip.id); setScreen("activeTrip"); }} onPenalty={handlePenalty} saving={saving} />}
          {screen === "activeTrip" && activeTrip && profile && <ActiveTripScreen trip={activeTrip} role={profile.role} chatMessages={chatMessages} chatDraft={chatDraft} setChatDraft={setChatDraft} onSendChatMessage={handleSendChatMessage} onStart={handleStartTrip} onFinish={handleFinishTrip} onEmergency={handleEmergency} onResolveEmergency={handleResolveEmergency} onShareRoute={handleShareRoute} onQuickMessage={handleQuickMessage} onGoRating={() => setScreen("rating")} onBackDriverPanel={() => setScreen("driverHome")} />}
          {screen === "rating" && activeTrip && <RatingScreen trip={activeTrip} rating={rating} setRating={setRating} comment={ratingComment} setComment={setRatingComment} onSubmit={handleSubmitRating} saving={saving} />}
          {screen === "profile" && profile && <ProfileScreen profile={profile} driverProfile={driverProfile} activeTrip={navigationTrip} onOpenActiveTrip={() => handleNavigate("activeTrip")} onLogout={handleLogout} />}
        </ScrollView>
        </KeyboardAvoidingView>
      )}
      {showNavigation && profile && (
        <AppNavigationBar
          role={profile.role}
          screen={screen}
          hasPendingRide={!!currentRide}
          hasActiveTrip={!!navigationTrip}
          onNavigate={handleNavigate}
        />
      )}
    </SafeAreaView>
  );
}

function createInitialChatMessages(tripId: string, profile: UserProfile | null): ChatMessage[] {
  const passengerName = profile?.role === "passenger" ? profile.name : "Luis Teran";
  return [
    {
      id: `demo-${tripId}-1`,
      tripId,
      fromUserId: "demo-driver",
      fromName: "Marco",
      fromRole: "driver",
      text: `Hola ${passengerName}, soy Marco. Ya estoy camino al punto indicado.`,
      createdAt: 1,
      localOnly: true,
    },
    {
      id: `demo-${tripId}-2`,
      tripId,
      fromUserId: "demo-system",
      fromName: "SmartHub",
      fromRole: "passenger",
      text: "Recuerda verificar placa, vehiculo y precio protegido antes de iniciar.",
      createdAt: 2,
      localOnly: true,
    },
  ];
}

function mergeMessages(current: ChatMessage[], incoming: ChatMessage[]) {
  const byId = new Map<string, ChatMessage>();
  [...current, ...incoming].forEach((message) => byId.set(message.id, message));
  return Array.from(byId.values()).sort((a, b) => timestampToMillis(a.createdAt) - timestampToMillis(b.createdAt));
}

function timestampToMillis(value: unknown) {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && "toMillis" in value && typeof (value as { toMillis: () => number }).toMillis === "function") {
    return (value as { toMillis: () => number }).toMillis();
  }
  return 0;
}
