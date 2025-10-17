# Changelog

## [1.0.2] - 2024-10-17

### Fixed
- **Breaking**: Fixed rem calculation to properly convert rem to px before dividing by base
  - Now: `2rem` with `remBase: 16` and `base: 4` → `calc(var(--spacing) * 8)`
  - Before: `2rem` → `calc(var(--spacing) * 2)` (incorrect)

### Added
- Added `remBase` option to configure rem-to-px conversion (default: 16)

## [1.0.1] - 2024-10-17

### Changed
- Minor documentation updates

## [1.0.0] - 2024-10-16

### Added
- Initial release
- Convert px/rem to calc(var(--spacing) * n) expressions
- Configurable base unit and variable name
- Preserve hairline borders option
- Property filtering support
- Universal builds: ES Module, CommonJS, UMD
