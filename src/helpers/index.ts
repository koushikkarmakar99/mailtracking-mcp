// Helper: format epoch ms to MM/DD/YYYY hh:mm:ss AM/PM UTC
export function formatDatetimeMsToMdYhmsUTC(ms: number) {
    try {
        const d = new Date(ms);
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(d.getUTCDate()).padStart(2, '0');
        const yyyy = d.getUTCFullYear();
        let hh = d.getUTCHours();
        const ampm = hh >= 12 ? 'PM' : 'AM';
        hh = hh % 12;
        if (hh === 0) hh = 12;
        const hhStr = String(hh).padStart(2, '0');
        const mins = String(d.getUTCMinutes()).padStart(2, '0');
        const secs = String(d.getUTCSeconds()).padStart(2, '0');
        return `${mm}/${dd}/${yyyy} ${hhStr}:${mins}:${secs} ${ampm}`;
    } catch (error) {
        console.error("Error formatting datetime:", error);
        return "Invalid date";
    }
}
