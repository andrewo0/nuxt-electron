import { app, BrowserWindow, nativeImage } from 'electron'
import * as path from 'path'

function isDev() {
	return process.env.NODE_ENV === 'development';
}

function getIconPath() {
	if (process.platform === 'darwin') {
		return isDev()
			? path.join(process.cwd(), 'public', 'MainFavicon.png')
			: path.join(__dirname, 'build', 'MainFavicon.icns');
	} else if (process.platform === 'win32') {
		return isDev()
			? path.join(process.cwd(), 'public', 'MainFavicon.ico')
			: path.join(__dirname, 'build', 'MainFavicon.ico');
	} else {
		return isDev()
			? path.join(process.cwd(), 'public', 'MainFavicon.png')
			: path.join(__dirname, 'build', 'MainFavicon.png');
	}
}

function createWindow() {
	const iconPath = getIconPath();
	const win = new BrowserWindow({
		width: 1200,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.cjs'),
			nodeIntegration: true
		},
		icon: iconPath
	});

	if (process.platform === 'darwin') {
		app.dock.setIcon(nativeImage.createFromPath(iconPath));
	}

	if (isDev()) {
		win.loadURL('http://localhost:3000');
	} else {
		const indexPath = path.join(__dirname, '../../dist/index.html');
		win.loadFile(indexPath);
	}
}

app.whenReady().then(() => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});
