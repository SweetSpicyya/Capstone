const SESSION_DURATION = 60 * 60 * 1000;

export const getCurrentUserWithSession = () => {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) return null;

    try {
        const user = JSON.parse(userJson);
        const currentTime = Date.now();

        if (currentTime - user.loginTimestamp > SESSION_DURATION) {
            localStorage.removeItem('currentUser');
            return null;
        }

        return user;
    } catch {
        return null;
    }
};