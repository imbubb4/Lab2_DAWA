// Datos en memoria con los nuevos campos
let students = [
  {
    id: 1,
    name: "Juan Pérez",
    grade: 20,
    age: 23,
    email: "juan.perez@ejemplo.com",
    phone: "+51 987654321",
    enrollmentNumber: "2025001",
    course: "Diseño y Desarrollo de Software C24",
    year: 3,
    subjects: ["Algoritmos", "Bases de Datos", "Redes"],
    gpa: 3.8,
    status: "Activo",
    admissionDate: "2022-03-01",
  },
  {
    id: 2,
    name: "Ana Gómez",
    grade: 16,
    age: 22,
    email: "ana.gomez@ejemplo.com",
    phone: "+51 987111222",
    enrollmentNumber: "2025002",
    course: "Diseño y Desarrollo de Software C24",
    year: 3,
    subjects: ["Algoritmos", "POO", "Redes"],
    gpa: 3.2,
    status: "Inactivo",
    admissionDate: "2021-03-01",
  },
  {
    id: 3,
    name: "Luis Díaz",
    grade: 14,
    age: 24,
    email: "luis.diaz@ejemplo.com",
    phone: "+51 999000111",
    enrollmentNumber: "2025003",
    course: "Diseño y Desarrollo de Software C24",
    year: 4,
    subjects: ["Arquitectura", "DevOps"],
    gpa: 2.9,
    status: "Activo",
    admissionDate: "2020-08-15",
  },
];

// CRUD básico
function getAll() { return students; }
function getById(id) { return students.find(s => s.id === id); }
function create(student) {
  student.id = (students.at(-1)?.id ?? 0) + 1;
  students.push(student);
  return student;
}
function update(id, updateData) {
  const idx = students.findIndex(s => s.id === id);
  if (idx === -1) return null;
  students[idx] = { ...students[idx], ...updateData };
  return students[idx];
}
function remove(id) {
  const idx = students.findIndex(s => s.id === id);
  if (idx === -1) return null;
  return students.splice(idx, 1)[0];
}

// Filtros requeridos por la tarea
function listByStatus(status) {
  const s = String(status || "").toLowerCase();
  return students.filter(x => String(x.status).toLowerCase() === s);
}
function listByGpaRange(min, max) {
  const lo = Number.isFinite(min) ? Number(min) : -Infinity;
  const hi = Number.isFinite(max) ? Number(max) : Infinity;
  return students.filter(x => x.gpa >= lo && x.gpa <= hi);
}

module.exports = {
  getAll, getById, create, update, remove,
  listByStatus, listByGpaRange
};
