interface Store {
  type: StoreType;
  watch(options: WatchOptions): void;
  read(path: string): Promise<string>;
  write(path: string, content: string): Promise<void>;
  delete(path: string): Promise<void>;
}

type StoreType = 'firebase' | 'gcs' | 'local';

interface WatchOptions {
  sourcePath: string;
  destinationPath: string;
  destination: Store;
}

interface StoreOptions {
  type: StoreType;
  path: string;
}
