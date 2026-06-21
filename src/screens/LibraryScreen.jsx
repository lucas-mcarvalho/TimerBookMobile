import React, { useMemo, useState } from "react";
import { FlatList, Image, Pressable, RefreshControl, Text, View, LayoutAnimation } from "react-native";
import getGlobalStyles from "../styles/globalStyles";
import getLibraryStyles from "../styles/library.styles";
import EmptyState from "../components/common/EmptyState";
import { getBookCover, getBookTitle, getReadingBookId } from "../utils/helpers";

// Icons
import PencilIcon from "../assets/PencilIcon.svg";
import TrashIcon from "../assets/TrashIcon.svg";

function LibraryScreen({
  apiUrl,
  books,
  inProgress,
  onStartBook,
  onDeleteBook,
  onRefresh,
  refreshing,
  onViewStats,
  theme
}) {
  const [isEditing, setIsEditing] = useState(false);
  const globalStyles = getGlobalStyles(theme);
  const libraryStyles = getLibraryStyles(theme);

  const toggleEdit = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsEditing(!isEditing);
  };

  const inProgressByBookId = useMemo(() => {
    const map = new Map();
    inProgress.forEach((reading) => {
      const bookId = getReadingBookId(reading);
      if (bookId) map.set(Number(bookId), reading);
    });
    return map;
  }, [inProgress]);
 
  return (
    <FlatList
      data={books}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={globalStyles.screenContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.accent} />}
      ListHeaderComponent={
        <View style={libraryStyles.sectionHeader}>
          <View style={libraryStyles.headerRow}>
            <View>
              <Text style={libraryStyles.eyebrow}>Biblioteca</Text>
              <Text style={[libraryStyles.title, { marginBottom: 0 }]}>Meus livros</Text>
            </View>
            <Pressable 
              onPress={toggleEdit} 
              style={[libraryStyles.editButton, isEditing && libraryStyles.editButtonActive]}
            >
              <PencilIcon width={20} height={20} color={isEditing ? "#ffffff" : theme.text} />
            </Pressable>
          </View>
        </View>
      }
      ListEmptyComponent={
        <EmptyState
          theme={theme}
          title="Sua biblioteca esta vazia"
          description="Cadastre seu primeiro livro na aba Novo."
        />
      }
      renderItem={({ item }) => {
        const coverUrl = getBookCover(item, apiUrl);
        const reading = inProgressByBookId.get(Number(item.id));
        return (
          <View style={libraryStyles.bookCard}>
            {coverUrl ? (
              <Image source={{ uri: coverUrl }} style={libraryStyles.cover} />
            ) : (
              <View style={libraryStyles.coverFallback}>
                <Text style={libraryStyles.coverFallbackText}>{getBookTitle(item).slice(0, 1)}</Text>
              </View>
            )}
            <View style={libraryStyles.bookInfo}>
              <Text style={libraryStyles.bookTitle}>{getBookTitle(item)}</Text>
              <Text numberOfLines={2} style={libraryStyles.bookDescription}>
                {item.description || "Sem descricao cadastrada."}
              </Text>
              {reading && (
                <Text style={libraryStyles.progressBadge}>
                  Em andamento na pagina {reading.currentPage ?? 0}
                </Text>
              )}
              <View style={libraryStyles.inlineActions}>
                <Pressable onPress={() => onStartBook(item, reading)} style={libraryStyles.smallAction}>
                  <Text style={libraryStyles.smallActionText}>Ler</Text>
                </Pressable>
                
                {reading && (
                  <Pressable 
                    onPress={() => onViewStats(reading.id)} 
                    style={[libraryStyles.smallAction, { backgroundColor: '#3b82f6' }]}
                  >
                    <Text style={libraryStyles.smallActionText}>Estatísticas</Text>
                  </Pressable>
                )}

                {isEditing && (
                  <Pressable 
                    onPress={() => onDeleteBook(item)} 
                    style={[libraryStyles.smallDangerAction, { width: 44, paddingHorizontal: 0 }]}
                  >
                    <TrashIcon width={20} height={20} color={theme.danger} />
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        );
      }}
    />
  );
}

export default LibraryScreen;
