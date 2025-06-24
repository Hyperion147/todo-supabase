import { useEffect } from 'react';
import { useTheme } from './ThemeProvider';

export default function Favicon() {
    const { theme } = useTheme();

    useEffect(() => {
        const updateFavicon = () => {
            const root = document.documentElement;
            
            const color = getComputedStyle(root).getPropertyValue('--color-text').trim();
            const backgroundColor = getComputedStyle(root).getPropertyValue('--color-background').trim();

            const iconPath = `
                M22 12
                h12
                v6
                h-8
                v20
                h-6
                v-20
                h-10
                z
            `.trim();

            const svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="24" fill="${backgroundColor}" />
                    <path d="${iconPath}" fill="${color}" />
                </svg>
            `;
            const link = document.createElement('link');
            link.rel = 'icon';
            link.href = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

            const oldIcons = document.querySelectorAll("link[rel='icon']");
            oldIcons.forEach(el => el.remove());

            document.head.appendChild(link);
        };

        updateFavicon();

        const timer = setTimeout(updateFavicon, 50);

        return () => {
            clearTimeout(timer);
            const links = document.querySelectorAll("link[rel='icon']");
            links.forEach(link => link.remove());
        };
    }, [theme]); // Only re-run when theme changes

    return null;
}