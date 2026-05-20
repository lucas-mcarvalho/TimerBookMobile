export function getErrorMessage(error) {
  return error?.message || "Algo saiu do esperado. Tente novamente.";
}

export function getBookTitle(book) {
  return book?.name || book?.title || "Livro sem titulo";
}

export function getBookCover(book, apiUrl) {
  const cover = book?.coverUrl || book?.coverPath;
  if (!cover) return null;
  if (/^https?:\/\//i.test(cover)) return cover;
  return `${apiUrl.replace(/\/+$/, "")}${cover.startsWith("/") ? cover : `/${cover}`}`;
}

export function sortSessionsByStartDesc(sessions) {
  return [...(Array.isArray(sessions) ? sessions : [])].sort(
    (a, b) => new Date(b.startedAt || 0) - new Date(a.startedAt || 0)
  );
}

export function getReadingBookId(reading) {
  return reading?.book?.id ?? reading?.bookId ?? reading?.book_id;
}

export function getUserPhoto(user, apiUrl) {
  const photo = user?.photoUrl || user?.photoPath || user?.photo;
  if (!photo) return null;
  if (/^https?:\/\//i.test(photo)) return photo;
  if (typeof photo === 'object' && photo.uri) return photo.uri;
  return `${apiUrl.replace(/\/+$/, "")}${photo.startsWith("/") ? photo : `/${photo}`}`;
}
