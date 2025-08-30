const http = require("http");
const repo = require("./repository/studentsRepository");

const PORT = 4000;

const json = (res, code, data) => {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
};

const readBody = (req, cb) => {
  let body = "";
  req.on("data", c => (body += c));
  req.on("end", () => {
    try { cb(null, body ? JSON.parse(body) : {}); }
    catch (e) { cb(new Error("JSON inválido")); }
  });
};

// Validación solicitada: name, email, course (carrera), phone
function validateStudent(s) {
  const errors = [];
  if (!s.name) errors.push("name es requerido");
  if (!s.email) errors.push("email es requerido");
  if (!s.course) errors.push("course es requerido");
  if (!s.phone) errors.push("phone es requerido");
  return errors;
}

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // ---- CRUD ----
  if (url === "/students" && method === "GET") {
    return json(res, 200, repo.getAll());
  }

  if (url.startsWith("/students/") && method === "GET") {
    const id = parseInt(url.split("/")[2]);
    const student = repo.getById(id);
    return student
      ? json(res, 200, student)
      : json(res, 404, { error: "Estudiante no encontrado" });
  }

  if (url === "/students" && method === "POST") {
    return readBody(req, (err, body) => {
      if (err) return json(res, 400, { error: err.message });
      const errs = validateStudent(body);
      if (errs.length) return json(res, 400, { error: "Validación", details: errs });
      const created = repo.create(body);
      return json(res, 201, created);
    });
  }

  if (url.startsWith("/students/") && method === "PUT") {
    const id = parseInt(url.split("/")[2]);
    const existing = repo.getById(id);
    if (!existing) return json(res, 404, { error: "Estudiante no encontrado" });

    return readBody(req, (err, body) => {
      if (err) return json(res, 400, { error: err.message });
      // Validamos el resultado final (merge)
      const merged = { ...existing, ...body };
      const errs = validateStudent(merged);
      if (errs.length) return json(res, 400, { error: "Validación", details: errs });

      const updated = repo.update(id, body);
      return json(res, 200, updated);
    });
  }

  if (url.startsWith("/students/") && method === "DELETE") {
    const id = parseInt(url.split("/")[2]);
    const removed = repo.remove(id);
    return removed
      ? json(res, 200, removed)
      : json(res, 404, { error: "Estudiante no encontrado" });
  }

  // ---- Endpoints adicionales ----
  // POST /ListByStatus  { "status": "Activo" }
  if (url === "/ListByStatus" && method === "POST") {
    return readBody(req, (err, body) => {
      if (err) return json(res, 400, { error: err.message });
      if (!body.status) return json(res, 400, { error: "status es requerido" });
      const list = repo.listByStatus(body.status);
      return json(res, 200, list);
    });
  }

  // POST /ListByGrade   { "min": 3.0, "max": 4.0 }  -> filtra por gpa
  if (url === "/ListByGrade" && method === "POST") {
    return readBody(req, (err, body) => {
      if (err) return json(res, 400, { error: err.message });
      const list = repo.listByGpaRange(body.min, body.max);
      return json(res, 200, list);
    });
  }

  // Default 404
  return json(res, 404, { error: "Ruta no encontrada" });
});

server.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
