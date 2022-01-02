type OutputApplyPattern = string | RegExp;
type ErrorLevel = 'off' | 'warn' | 'error';
type OverrideValue = string | Record<string, string> | boolean | undefined;

interface MetablockPluginOption {
  // input options
  file?: string;

  // runtime options
  order?: string[];
  errorLevel?: ErrorLevel;
  manager?: string | string[];
  override?: Record<string, OverrideValue>;

  // output options
  applyTo?: OutputApplyPattern | OutputApplyPattern[];
  sourcemap?: boolean;
}

interface TransformConfig {
  order: string[];
  managers: string[];
  errorLevel: ErrorLevel;
  supportedMetaKeys: string[];
  override?: Record<string, OverrideValue>;
}

interface OutputConfig {
  applyPatterns: OutputApplyPattern[];
}
