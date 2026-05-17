import React, { useState } from "react";
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions 
} from "react-native";

const { width } = Dimensions.get("window");

const guideSteps = [
  {
    tag: "INÍCIO",
    title: "Bem-vindo ao app",
    text: "Aqui é a sua tela inicial. Use o menu inferior para navegar pelas funcionalidades principais.",
  },
  {
    tag: "BIBLIOTECA",
    title: "Seus Livros",
    text: "Na aba Livros você acessa todos os seus livros e pode começar novas leituras.",
  },
  {
    tag: "PERFIL & META",
    title: "Meta de leitura",
    text: "No seu Perfil, use a opção de alterar a meta para definir seus minutos diários.",
    actionLabel: "Ir para Perfil",
    actionTo: "profile",
  },
  {
    tag: "ESTATÍSTICAS",
    title: "Acompanhe seu progresso",
    text: "Veja suas páginas lidas, tempo total e sua sequência de dias lendo.",
  }
];

const HomeGuide = ({ onNavigateProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  const currentStep = guideSteps[step];
  const progress = ((step + 1) / guideSteps.length) * 100;

  const nextStep = () => {
    if (step < guideSteps.length - 1) {
      setStep(step + 1);
    } else {
      closeGuide();
    }
  };

  const previousStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const closeGuide = () => {
    setIsOpen(false);
    setStep(0);
  };

  const handleStepAction = () => {
    if (!currentStep.actionTo) return;
    closeGuide();
    if (currentStep.actionTo === "profile") {
      onNavigateProfile?.();
    }
  };

  return (
    <>
      {/* Botão Flutuante (Guia) */}
      <TouchableOpacity style={styles.guideButton} onPress={() => setIsOpen(true)}>
        <Text style={styles.guideButtonText}>Guia</Text>
      </TouchableOpacity>

      {/* Modal do Guia */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={closeGuide}
      >
        <View style={styles.overlay}>
          <View style={styles.card}>
            
            <TouchableOpacity style={styles.closeButton} onPress={closeGuide}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            <Text style={styles.icon}>📘</Text>
            <Text style={styles.tag}>{currentStep.tag}</Text>
            <Text style={styles.title}>{currentStep.title}</Text>
            <Text style={styles.text}>{currentStep.text}</Text>

            {/* Barra de Progresso */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>

            {/* Rodapé (Passos e Botões) */}
            <View style={styles.footer}>
              <Text style={styles.stepText}>
                {step + 1} de {guideSteps.length}
              </Text>

              <View style={styles.actions}>
                {/* Botão de Ação (ex: Ir para Perfil) */}
                {currentStep.actionTo && (
                  <TouchableOpacity style={[styles.btn, styles.btnAction]} onPress={handleStepAction}>
                    <Text style={styles.btnActionText}>{currentStep.actionLabel}</Text>
                  </TouchableOpacity>
                )}

                {/* Botão Voltar */}
                <TouchableOpacity 
                  style={[styles.btn, step === 0 && styles.btnDisabled]} 
                  onPress={previousStep} 
                  disabled={step === 0}
                >
                  <Text style={[styles.btnText, step === 0 && styles.btnTextDisabled]}>Voltar</Text>
                </TouchableOpacity>

                {/* Botão Próximo / Finalizar */}
                <TouchableOpacity style={[styles.btn, styles.btnNext]} onPress={nextStep}>
                  <Text style={styles.btnNextText}>
                    {step === guideSteps.length - 1 ? "Finalizar" : "Próximo"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  guideButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    zIndex: 999,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 16,
    backgroundColor: "#2457a6",
    elevation: 8, // Sombra para Android
    shadowColor: "#2457a6", // Sombra para iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  guideButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(4, 8, 20, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: width * 0.9,
    maxWidth: 400,
    backgroundColor: "#101827",
    borderColor: "#283752",
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 10,
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  closeButtonText: {
    color: "#cbd5e1",
    fontSize: 14,
  },
  icon: {
    fontSize: 42,
    marginBottom: 10,
  },
  tag: {
    color: "#67e8f9",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  text: {
    color: "#cbd5e1",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 24,
  },
  progressContainer: {
    width: "100%",
    height: 6,
    backgroundColor: "#263348",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#facc15", // Amarelo (você pode trocar pelo gradiente nativo depois se quiser)
  },
  footer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    gap: 15,
  },
  stepText: {
    color: "#cbd5e1",
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#334155",
    backgroundColor: "#111827",
  },
  btnText: {
    color: "white",
    fontWeight: "600",
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnTextDisabled: {
    color: "#94a3b8",
  },
  btnNext: {
    backgroundColor: "#facc15",
    borderColor: "#facc15",
  },
  btnNextText: {
    color: "#111827",
    fontWeight: "bold",
  },
  btnAction: {
    backgroundColor: "#2457a6",
    borderColor: "#3b82f6",
  },
  btnActionText: {
    color: "white",
    fontWeight: "bold",
  }
});

export default HomeGuide;
