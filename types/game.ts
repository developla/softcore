export interface SceneChoice {
  choiceIndex: number;
  choiceText: string;
  sceneId: string;
}
export interface Scene {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  choices: string[];
  chapter: number;
  sceneNumber: number;
  nftMinted: boolean;
  userChoices?: SceneChoice[];
  _updateKey?: number;
  status: "GENERATING" | "COMPLETED" | "FAILED";
}
export interface Character {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
export interface User {
  id: string;
  username: string;
  email: string;
  walletAddress?: string;
  stamina: number;
  selectedCharacterId?: string;
}
export interface SceneContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  character: Character | null;
  allScenes: Scene[];
  setAllScenes: (scenes: Scene[]) => void;
  currentScene: Scene | null;
  currentIndex: number;
  selectedChoice: number | undefined;
  user: User | null;
  isChoiceProcessing: boolean;
  fetchSceneData: (characterId: string) => Promise<void>;
  handleChoiceSelect: (choice: string, index: number) => Promise<void>;
  handleNextScene: () => Promise<void>;
  handlePreviousScene: () => void;
  handleMintScene: () => Promise<void>;
  handleSceneSelect: (index: number) => void;
  setCurrentIndex: (index: number) => void;
  setCurrentScene: (scene: Scene | null) => void;
  setSelectedChoice: (choice: number | undefined) => void;
  isStaminaPurchaseOpen: boolean;
  setIsStaminaPurchaseOpen: (isOpen: boolean) => void;
}

export interface SceneChoice {
  choiceIndex: number;
  choiceText: string;
  sceneId: string;
}

export interface Scene {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  choices: string[];
  chapter: number;
  sceneNumber: number;
  nftMinted: boolean;
  userChoices?: SceneChoice[];
  _updateKey?: number;
  status: "GENERATING" | "COMPLETED" | "FAILED";
}

export interface Character {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  walletAddress?: string;
  stamina: number;
  selectedCharacterId?: string;
}

export interface SceneContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  character: Character | null;
  allScenes: Scene[];
  setAllScenes: (scenes: Scene[]) => void;
  currentScene: Scene | null;
  currentIndex: number;
  selectedChoice: number | undefined;
  user: User | null;
  isChoiceProcessing: boolean;
  fetchSceneData: (characterId: string) => Promise<void>;
  handleChoiceSelect: (choice: string, index: number) => Promise<void>;
  handleNextScene: () => Promise<void>;
  handlePreviousScene: () => void;
  handleMintScene: () => Promise<void>;
  handleSceneSelect: (index: number) => void;
  setCurrentIndex: (index: number) => void;
  setCurrentScene: (scene: Scene | null) => void;
  setSelectedChoice: (choice: number | undefined) => void;
  isStaminaPurchaseOpen: boolean;
  setIsStaminaPurchaseOpen: (isOpen: boolean) => void;
}
