import {
  addDoc,
  collection,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDpPw1zF0sVhk5K0W7Sjm8bSKOyjvFqRn8",
  authDomain: "estimation-b46d9.firebaseapp.com",
  projectId: "estimation-b46d9",
  storageBucket: "estimation-b46d9.firebasestorage.app",
  messagingSenderId: "663828177104",
  appId: "1:663828177104:web:d0a133f96071cabd587ed5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface Submodule {
  id: string;
  name: string;
  time: number;
  description: string;
}

export interface Module {
  id: string;
  name: string;
  projectId: string;
  submodules: Submodule[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export const saveProjectEstimate = async (projectData: any) => {
  try {
    // First, create the project document
    const projectRef = await addDoc(collection(db, "projects"), {
      title: projectData.title,
      description: projectData.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Then create modules with reference to project
    const modulesPromises = projectData.modules.map(async (module: any) => {
      const moduleRef = await addDoc(collection(db, "modules"), {
        name: module.name,
        projectId: projectRef.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create submodules with reference to module
      const submodulesPromises = module.submodules.map((submodule: any) =>
        addDoc(collection(db, "submodules"), {
          name: submodule.name,
          time: submodule.time,
          description: submodule.description,
          moduleId: moduleRef.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );

      await Promise.all(submodulesPromises);
      return moduleRef;
    });

    await Promise.all(modulesPromises);
    return projectRef.id;
  } catch (error) {
    console.error("Error saving to Firebase:", error);
    throw error;
  }
};

export { db };
