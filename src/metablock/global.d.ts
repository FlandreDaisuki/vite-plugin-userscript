type OutputApplyPattern = string | RegExp;
type ErrorLevel = 'off' | 'warn' | 'error';
type OverrideValue = string | Record<string, string> | boolean | undefined;
type SupportedScriptManager = 'tm' |
  'tampermonkey' |
  'gm3' |
  'greasemonkey3' |
  'gm' |
  'gm4' |
  'greasemonkey' |
  'greasemonkey4' |
  'vm' |
  'violentmonkey' |
  'compatible' |
  'all'

interface MetablockPluginOption {
  // input options
  file?: string;

  // runtime options
  order?: string[];
  errorLevel?: ErrorLevel;
  manager?: SupportedScriptManager | SupportedScriptManager[];
  override?: Record<string, OverrideValue>;

  // output options
  applyTo?: OutputApplyPattern | OutputApplyPattern[];
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
