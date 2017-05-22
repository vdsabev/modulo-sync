interface ModuloPlugin {
  type: ModuloPluginType;
  read(path: string): Promise<string>;
  write(path: string, content: string): Promise<void>;
  delete(path: string): Promise<void>;
  watch?(options: WatchOptions): void;
}

type ModuloPluginType = 'file' | 'firebase' | 'gcs';

interface WatchOptions {
  sourcePath: string;
  destinationPath: string;
  destination: ModuloPlugin;
}
