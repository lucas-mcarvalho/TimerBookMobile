import React, { useMemo } from "react";
import { FlatList, Image, Pressable, RefreshControl, Text, View } from "react-native";
import globalStyles from "../styles/globalStyles";
import libraryStyles from "../styles/library.styles";
import EmptyState from "../components/common/EmptyState";
import { getBookCover, getBookTitle, getReadingBookId } from "../utils/helpers";

function LibraryScreen({
  apiUrl,
  books,
  inProgress,
  onStartBook,
  onDeleteBook,
  onRefresh,
  refreshing,
  onViewStats
}) {
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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListHeaderComponent={
        <View style={libraryStyles.sectionHeader}>
          <View>
            <Text style={libraryStyles.eyebrow}>Biblioteca</Text>
            <Text style={libraryStyles.title}>Meus livros</Text>
          </View>
        </View>
      }
      ListEmptyComponent={
        <EmptyState
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

                <Pressable onPress={() => onDeleteBook(item)} style={libraryStyles.smallDangerAction}>
                  <Text style={libraryStyles.smallDangerText}>Excluir</Text>
                </Pressable>
              </View>
            </View>
          </View>
        );
      }}
    />
  );
}

export default LibraryScreen;
