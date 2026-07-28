/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

// PNG frames, not JPEG — the alerts are overlays and need an alpha channel.
Config.setVideoImageFormat("png");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig(enableTailwind);
