export const sharedStyles = {
    pageContainer: 'page-container',
    gradientBg: 'gradient-bg',
    imageBg: 'image-bg',
    contentContainer: 'content-container',
    wideContentContainer: 'wide-content-container',
    heading: 'heading',
    form: 'form',
    input: 'input',
    select: 'select',
    button: 'button',
    label: 'label',
    errorText: 'error-text',
    successText: 'success-text',
    guestRegistrationScrollableContainer: `
        max-height: calc(100vh - 300px); 
        overflow-y-auto; 
        pr-4; 
        scrollbar-thin; 
        scrollbar-thumb-gray-400; 
        scrollbar-track-gray-200; 
        hover:scrollbar-thumb-gray-500; 
        scrollbar-thumb-rounded-full; 
        scrollbar-track-rounded-full;
    `,
};

export const getThemeStyles = (theme: string) => {
    switch (theme) {
        case 'dark':
            return {
                bg: 'bg-gray-900',
                text: 'text-white',
                heading: 'text-purple-300',
                input: 'bg-gray-800 border-gray-700 text-white',
                button: 'bg-purple-600 hover:bg-purple-700',
            };
        case 'light':
            return {
                bg: 'bg-gray-100',
                text: 'text-gray-900',
                heading: 'text-purple-800',
                input: 'bg-white border-gray-300 text-gray-900',
                button: 'bg-purple-500 hover:bg-purple-600',
            };
        default:
            return {
                bg: sharedStyles.gradientBg,
                text: 'text-gray-900',
                heading: 'text-purple-800',
                input: 'bg-white border-gray-300 text-gray-900',
                button: 'bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500',
            };
    }
};