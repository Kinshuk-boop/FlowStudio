import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './config';
import { Project } from '@/lib/types/project';

// Collection path: users/{uid}/projects/{projectId}
const projectsCol = (uid: string) => collection(db, 'users', uid, 'projects');
const projectDoc = (uid: string, projectId: string) =>
  doc(db, 'users', uid, 'projects', projectId);

// ── Read ──────────────────────────────────────────────────────────────────────

export async function getUserProjects(uid: string): Promise<Project[]> {
  const q = query(projectsCol(uid), orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Project);
}

// ── Write ─────────────────────────────────────────────────────────────────────

export async function saveProject(uid: string, project: Project): Promise<void> {
  await setDoc(projectDoc(uid, project.id), {
    ...project,
    // Overwrite timestamps with server time for consistency
    updatedAt: new Date().toISOString(),
  });
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function removeProject(uid: string, projectId: string): Promise<void> {
  await deleteDoc(projectDoc(uid, projectId));
}
