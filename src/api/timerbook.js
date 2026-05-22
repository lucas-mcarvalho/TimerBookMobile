import { apiFetch } from "./client";

function createFilePart(file, fallbackName, fallbackType) {
  if (!file?.uri) {
    return null;
  }

  return {
    uri: file.uri,
    name: file.name || file.fileName || fallbackName,
    type: file.mimeType || file.type || fallbackType
  };
}

export async function loginUser(email, password) {
  return apiFetch("/auth/login", {
    method: "POST",
    skipAuth: true,
    body: { email, password }
  });
}

export async function registerUser({ username, email, password, dailyReadingGoalMinutes, photo }) {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("email", email);
  formData.append("password", password);

  if (dailyReadingGoalMinutes) {
    formData.append("dailyReadingGoalMinutes", String(dailyReadingGoalMinutes));
  }

  const photoPart = createFilePart(photo, "profile.jpg", "image/jpeg");

  if (photoPart) {
    formData.append("photo", photoPart);
  }

  return apiFetch("/auth/register", {
    method: "POST",
    skipAuth: true,
    multipart: true,
    body: formData
  });
}

export async function getMe() {
  return apiFetch("/user/me");
}

export async function updateReadingGoal(dailyReadingGoalMinutes) {
  return apiFetch("/user/me/reading-goal", {
    method: "PUT",
    body: { dailyReadingGoalMinutes: Number(dailyReadingGoalMinutes) }
  });
}

export async function updateProfile(userId, { username, email }, photo, removePhoto = false) {
  const formData = new FormData();
  
  if (username) {
    formData.append("username", username);
  }
  
  if (email) {
    formData.append("email", email);
  }

  if (removePhoto) {
    formData.append("removePhoto", "true");
  }

  if (photo) {
    const photoPart = createFilePart(photo, "profile.jpg", "image/jpeg");
    if (photoPart) {
      formData.append("photo", photoPart);
    }
  }

  // Tentar usar o ID na URL ou /me dependendo da convenção do projeto
  return apiFetch(`/user/${userId}`, {
    method: "PUT",
    multipart: true,
    body: formData
  });
}

export async function getBooksByUserId(userId) {
  return apiFetch(`/book/user/${userId}`);
}

export async function createBook(userId, { name, description, cover, pdf }) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);

  const coverPart = createFilePart(cover, "cover.jpg", "image/jpeg");
  const pdfPart = createFilePart(pdf, "book.pdf", "application/pdf");

  if (coverPart) {
    formData.append("cover", coverPart);
  }

  if (pdfPart) {
    formData.append("pdf", pdfPart);
  }

  return apiFetch(`/book/create?userId=${userId}`, {
    method: "POST",
    multipart: true,
    body: formData
  });
}

export async function deleteBook(bookId) {
  return apiFetch(`/book/${bookId}`, {
    method: "DELETE"
  });
}

export async function getGeneralStats() {
  return apiFetch("/stats/user/general");
}

export async function getBooksInProgress() {
  return apiFetch("/stats/books-in-progress");
}

export async function startReading(userId, bookId, startPage = 0) {
  return apiFetch(`/readings/${userId}/start`, {
    method: "POST",
    body: {
      bookId,
      startPage: Number(startPage) || 0
    }
  });
}

export async function startReadingSession(readingId, startPage = 0) {
  return apiFetch("/reading-sessions/start", {
    method: "POST",
    body: {
      readingId,
      startPage: Number(startPage) || 0
    }
  });
}

export async function getSessionsByReadingId(readingId) {
  return apiFetch(`/reading-sessions/reading/${readingId}`);
}

export async function finishReadingSession(sessionId, endPage) {
  return apiFetch(`/reading-sessions/${sessionId}/finish`, {
    method: "PUT",
    body: {
      endPage: Number(endPage) || 0
    }
  });
} 

export async function getReadingStats(readingId) {
  return apiFetch(`/stats/reading/${readingId}?includeOngoing=true`);
}


