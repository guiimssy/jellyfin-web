import type { ColorSystemOptions, ThemeOptions } from '@mui/material/styles';
import type {} from '@mui/material/themeCssVarsAugmentation';

const LIST_ICON_WIDTH = 36;
const HEADING_FONT_FAMILY = '"Montserrat", "Inter", "Noto Sans", sans-serif';

/** The default "Dark" color scheme. */
export const DEFAULT_COLOR_SCHEME: ColorSystemOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#e50914',
            contrastText: '#fff'
        },
        secondary: {
            main: '#e50914',
            contrastText: '#fff'
        },
        background: {
            default: '#0b0b0f',
            paper: '#15151b'
        },
        action: {
            selectedOpacity: 0.2
        },
        starIcon: {
            main: '#f2b01e' // Yellow color
        },
        error: {
            main: '#c62828' // Red color
        },
        AppBar: {
            defaultBg: '#0b0b0f'
        }
    }
};

/** The default customizations to the default MUI theme. */
export const DEFAULT_THEME_OPTIONS: ThemeOptions = {
    shape: {
        borderRadius: 8
    },
    typography: {
        fontFamily: '"Inter", "Noto Sans", sans-serif',
        button: {
            textTransform: 'none',
            fontWeight: 600
        },
        h1: {
            fontFamily: HEADING_FONT_FAMILY,
            fontWeight: 800,
            fontSize: '1.8rem'
        },
        h2: {
            fontFamily: HEADING_FONT_FAMILY,
            fontWeight: 700,
            fontSize: '1.5rem'
        },
        h3: {
            fontFamily: HEADING_FONT_FAMILY,
            fontWeight: 700,
            fontSize: '1.17rem'
        },
        h4: {
            fontFamily: HEADING_FONT_FAMILY,
            fontWeight: 700
        },
        h5: {
            fontFamily: HEADING_FONT_FAMILY,
            fontWeight: 700
        },
        h6: {
            fontFamily: HEADING_FONT_FAMILY,
            fontWeight: 700
        }
    },
    components: {
        MuiAlert: {
            styleOverrides: {
                message: {
                    // NOTE: This seems like a bug. Block content does not fill the container width.
                    flexGrow: 1
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                colorTransparent: ({ theme }) => ({
                    color: theme.vars.palette.text.primary
                })
            }
        },
        MuiButton: {
            defaultProps: {
                variant: 'contained'
            },
            variants: [
                {
                    props: {
                        size: 'large'
                    },
                    style: {
                        fontSize: '1rem',
                        fontWeight: 'bold'
                    }
                }
            ]
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    // Same rounding as the cards instead of a pill shape
                    borderRadius: 'var(--jf-card-borderRadius, 10px)'
                }
            }
        },
        MuiFormControl: {
            defaultProps: {
                variant: 'filled'
            }
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    fontSize: '1rem'
                }
            }
        },
        MuiTextField: {
            defaultProps: {
                variant: 'filled'
            }
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: LIST_ICON_WIDTH
                }
            }
        },
        MuiListSubheader: {
            styleOverrides: {
                root: {
                    // NOTE: Added for drawer subheaders, but maybe it won't work in other cases?
                    backgroundColor: 'inherit',
                    position: 'initial'
                }
            }
        },
        MuiListItemText: {
            styleOverrides: {
                inset: {
                    paddingLeft: LIST_ICON_WIDTH
                }
            }
        }
    }
};
