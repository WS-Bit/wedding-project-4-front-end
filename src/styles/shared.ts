export const sharedStyles = {
    pageContainer: 'page-container',
    gradientBg: 'bg-gradient-to-br from-[#d8c7cb] via-[#bca7ab] to-[#a08d91]',
    imageBg: 'image-bg',
    contentContainer: 'w-full max-w-md p-8 bg-white rounded-lg shadow-lg border border-[#bca7ab]',
    wideContentContainer: 'w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg border border-[#bca7ab]',
    heading: 'text-3xl font-serif text-center mb-6 text-[#46393b]',
    form: 'space-y-4',
    input: 'w-full p-2 border border-[#bca7ab] rounded-md focus:ring-2 focus:ring-[#bca7ab] focus:border-[#a08d91] transition-all',
    select: 'w-full p-2 border border-[#bca7ab] rounded-md focus:ring-2 focus:ring-[#bca7ab] focus:border-[#a08d91] transition-all',
    button: 'w-full py-2 px-4 bg-gradient-to-r from-[#bca7ab] to-[#a08d91] text-white rounded-md hover:from-[#a08d91] hover:to-[#8b7276] focus:outline-none focus:ring-2 focus:ring-[#bca7ab] border border-[#bca7ab] shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105',
    label: 'block text-sm font-medium text-[#8b7276] mb-1',
    errorText: 'mt-2 text-sm text-red-600',
    successText: 'mt-2 text-sm text-[#8b7276]',
    guestRegistrationScrollableContainer: `
        max-height: calc(100vh - 300px); 
        overflow-y-auto; 
        pr-4; 
        scrollbar-thin; 
        scrollbar-thumb-[#bca7ab]; 
        scrollbar-track-[#d8c7cb]; 
        hover:scrollbar-thumb-[#a08d91]; 
        scrollbar-thumb-rounded-full; 
        scrollbar-track-rounded-full;
    `,
};

export const getThemeStyles = (theme: string) => {
    switch (theme) {
        case 'dark':
            return {
                bg: 'bg-[#2d2426]',
                text: 'text-[#e6e6e6]',
                heading: 'text-[#bca7ab]',
                input: 'bg-[#3d3133] border-[#bca7ab] text-white',
                button: 'bg-gradient-to-r from-[#bca7ab] to-[#a08d91] hover:from-[#a08d91] hover:to-[#8b7276] border-[#bca7ab] focus:ring-[#bca7ab]',
            };
        case 'light':
            return {
                bg: 'bg-[#f5f0f1]',
                text: 'text-[#2d2426]',
                heading: 'text-[#8b7276]',
                input: 'bg-white border-[#bca7ab] text-[#2d2426]',
                button: 'bg-gradient-to-r from-[#bca7ab] to-[#a08d91] hover:from-[#a08d91] hover:to-[#8b7276] border-[#bca7ab] focus:ring-[#bca7ab]',
            };
        default:
            return {
                bg: sharedStyles.gradientBg,
                text: 'text-[#2d2426]',
                heading: 'text-[#8b7276]',
                input: 'bg-white border-[#bca7ab] text-[#2d2426]',
                button: 'bg-gradient-to-r from-[#bca7ab] to-[#a08d91] hover:from-[#a08d91] hover:to-[#8b7276] border-[#bca7ab] focus:ring-[#bca7ab]',
            };
    }
};