interface Store {
  type: StoreType;
  read(path: string): Promise<string>;
  write(path: string, content: string): Promise<void>;
  delete(path: string): Promise<void>;
  watch?(options: WatchOptions): void;
}

type StoreType = 'firebase' | 'gcs' | 'local';

interface WatchOptions {
  sourcePath: string;
  destinationPath: string;
  destination: Store;
}
