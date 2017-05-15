interface StoreModule {
  type: StoreType;
  sync(options: StoreOptions): void;
}

interface StoreOptions {
  source: Store;
  destination: Store;
}

interface Store {
  type: StoreType;
  path: string;
}

type StoreType = 'local' | 'firebase' | 'gcs';
