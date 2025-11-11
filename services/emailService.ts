
// This is a placeholder for the EmailJS library.
// In a real project, you would install it via npm.
// For this environment, we assume it's loaded from a script tag.
declare global {
    interface Window {
        emailjs: {
            init: (config: { publicKey: string }) => void;
            send: (serviceID: string, templateID: string, params: Record<string, unknown>) => Promise<any>;
        };
    }
}

let isEmailJsInitialized = false;

const initializeEmailJs = () => {
    if (typeof window.emailjs !== 'undefined') {
        // IMPORTANT: Replace with your public key from EmailJS
        window.emailjs.init({ publicKey: 'mklKBU7mBH0e6O4Pi' });
        isEmailJsInitialized = true;
    } else {
        console.error("EmailJS script not loaded.");
    }
};

export const sendNotificationEmail = async (params: Record<string, unknown>) => {
    if (!isEmailJsInitialized) {
        initializeEmailJs();
    }

    if (!isEmailJsInitialized) {
        console.error('EmailJS is not available. Cannot send email.');
        return;
    }

    // IMPORTANT: Replace with your Service ID and Template ID
    const serviceID = 'service_47nhzft';
    const templateID = 'template_6d1wc0h';

    try {
        await window.emailjs.send(serviceID, templateID, params);
        console.log('Success: Notification email sent.');
    } catch (err) {
        console.error('Failed to send notification email. Error: ', err);
    }
};
