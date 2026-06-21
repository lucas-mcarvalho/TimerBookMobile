import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert, Linking } from "react-native";
import getGlobalStyles from "../styles/globalStyles";
import getAssinaturaStyles from "../styles/assinatura.styles";
import PrimaryButton from "../components/common/PrimaryButton";
import { getErrorMessage } from "../utils/helpers";

const plans = [
  {
    id: "free",
    name: "Gratuito",
    price: "R$ 0",
    period: "para sempre",
    description: "Para organizar sua biblioteca e manter o ritmo de leitura.",
    features: ["Biblioteca pessoal", "Registro de leituras", "Meta diária", "Perfil do leitor"],
    actionLabel: "Plano atual",
  },
  {
    id: "monthly",
    name: "Premium mensal",
    price: "R$ 19,90",
    period: "por mês",
    description: "Para acompanhar evolução, estatísticas e recursos avançados.",
    badge: "Mais flexível",
    features: ["Livros ilimitados", "Estatísticas completas", "Relatórios de progresso", "Recursos de IA"],
    actionLabel: "Assinar mensal",
  },
];

function formatSubscriptionStatus(status) {
  const labels = {
    ACTIVE: "Premium ativo",
    FREE: "Gratuito",
    PENDING: "Pagamento pendente",
    CANCELLED: "Cancelado",
    PAST_DUE: "Pagamento atrasado",
  };
  return labels[status] || status || "Gratuito";
}

function AssinaturaScreen({ 
  theme, 
  user, 
  subscription, 
  loading, 
  onSubscribe, 
  onManagePortal, 
  onResendReceipt,
  onBack,
}) {
  const globalStyles = getGlobalStyles(theme);
  const styles = getAssinaturaStyles(theme);
  
  const [selectedPlanId, setSelectedPlanId] = useState("monthly");
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) || plans[1],
    [selectedPlanId]
  );

  const subscriptionStatus = subscription?.status || user?.subscriptionPlan || "FREE";
  const currentPlanName = formatSubscriptionStatus(subscriptionStatus);
  const renewalDate = subscription?.currentPeriodEnd || user?.subscriptionRenewalDate || user?.planRenewalDate;

  const handleCheckout = async () => {
    if (selectedPlan.id === "free") {
      Alert.alert("Aviso", "Você já está no plano gratuito.");
      return;
    }

    setIsProcessing(true);
    try {
      // onSubscribe deve chamar a sua API e retornar a URL de checkout do Mercado Pago
      const checkoutUrl = await onSubscribe(selectedPlan.id);
      
      if (checkoutUrl) {
        await Linking.openURL(checkoutUrl);
      } else {
        Alert.alert("Erro", "Nenhuma URL de pagamento foi retornada.");
      }
    } catch (error) {
      Alert.alert("Erro no Pagamento", getErrorMessage(error));
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <View style={[globalStyles.screenContent, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={theme.accent} />
        <Text style={{ marginTop: 10, color: theme.subtext }}>Carregando dados da assinatura...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Back row */}
        <View style={{ marginBottom: 8 }}>
          <Pressable onPress={() => (onBack ? onBack() : null)} style={{ padding: 8, alignSelf: 'flex-start' }}>
            <Text style={{ color: theme.accent, fontWeight: '700' }}>◀ Voltar</Text>
          </Pressable>
        </View>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.kicker}>Plano e pagamento</Text>
          <Text style={styles.title}>Assinatura TimerBook</Text>
          <Text style={styles.description}>
            Escolha o plano que combina com sua rotina de leitura e continue pelo checkout seguro.
          </Text>
        </View>

        {/* Status Box (Reaproveitando a lógica de Box do seu Perfil) */}
        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Plano atual</Text>
          <Text style={styles.statusValue}>{currentPlanName}</Text>
          
          {renewalDate && (
            <Text style={styles.statusSubtext}>
              Renova em {new Date(renewalDate).toLocaleDateString("pt-BR")}
            </Text>
          )}

          {subscription?.providerSubscriptionId && (
            <View style={styles.actionButtonsRow}>
              <PrimaryButton theme={theme} onPress={onManagePortal} variant="secondary" style={{ flex: 1, marginRight: 8 }}>
                Gerenciar
              </PrimaryButton>
              <PrimaryButton theme={theme} onPress={onResendReceipt} variant="secondary" style={{ flex: 1 }}>
                Comprovante
              </PrimaryButton>
            </View>
          )}
        </View>

        {/* Lista de Planos */}
        <View style={styles.plansGrid}>
          {plans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;

            return (
              <Pressable
                key={plan.id}
                onPress={() => setSelectedPlanId(plan.id)}
                style={[
                  styles.planCard,
                  isSelected && styles.planCardSelected
                ]}
              >
                {plan.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{plan.badge}</Text>
                  </View>
                )}

                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planDescription}>{plan.description}</Text>

                <View style={styles.priceRow}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.planPeriod}> {plan.period}</Text>
                </View>

                <View style={styles.featuresList}>
                  {plan.features.map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                      <Text style={styles.featureCheck}>✓</Text>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar - Barra Fixa para o Checkout */}
      <View style={styles.stickyBottomBar}>
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryLabel}>Total a pagar</Text>
            <Text style={styles.summaryPrice}>{selectedPlan.price}</Text>
          </View>
          <View style={{ minWidth: 160 }}>
            <PrimaryButton 
              theme={theme} 
              onPress={handleCheckout} 
              disabled={isProcessing || selectedPlanId === "free"}
            >
              {isProcessing ? "Abrindo..." : (selectedPlanId === "free" ? "Plano Atual" : "Continuar")}
            </PrimaryButton>
          </View>
        </View>
      </View>
    </View>
  );
}

export default AssinaturaScreen;