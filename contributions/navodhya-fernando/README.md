# 🌟 Navii's Interactive Particle Button

A modern, interactive button component featuring dynamic gradients, particle effects, and smooth animations. Built with vanilla HTML, CSS, and JavaScript.

## ✨ Features

- **Dynamic Gradient Shifts**: Color changes based on interaction count
- **Particle Explosion Effects**: Beautiful particles burst on each click
- **Ripple Animations**: Smooth ripple effects on hover
- **Click Tracking**: Visual feedback with click counter
- **Responsive Design**: Works perfectly on all devices
- **Accessibility**: ARIA labels and semantic HTML
- **Smooth Animations**: Cubic-bezier transitions for professional feel

## 🚀 Demo

Open `button.html` in your browser to see the interactive button in action!

## 📋 Usage

### Quick Start

1. **Download the files**: `button.html`, `button.css`, `button.js`
2. **Open `button.html`** in your browser to see the demo
3. **Copy the code** into your project

### Integration Steps

#### Step 1: Include CSS and JavaScript
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="path/to/button.css">
</head>
<body>
    <!-- Your content here -->
    <script src="path/to/button.js"></script>
</body>
</html>
```

#### Step 2: Add Button HTML
```html
<button class="navii-pulse-button" aria-label="Interactive gradient button with particle effects">
    <span class="button-text">GET STARTED</span>
    <span class="button-icon">✨</span>
</button>
```

#### Step 3: Customize Button Text (Optional)
```html
<!-- Different button variations -->
<button class="navii-pulse-button">
    <span class="button-text">LEARN MORE</span>
    <span class="button-icon">🚀</span>
</button>

<button class="navii-pulse-button">
    <span class="button-text">DOWNLOAD</span>
    <span class="button-icon">⬇️</span>
</button>

<button class="navii-pulse-button">
    <span class="button-text">CONTACT US</span>
    <span class="button-icon">📧</span>
</button>
```

### JavaScript API

```javascript
// Buttons automatically initialize on page load
// Access button instance for advanced control:

const button = document.querySelector('.navii-pulse-button');
const naviiButton = new NaviiButton(button);

// Available methods:
naviiButton.reset();           // Reset click counter to 0
naviiButton.clickCount;        // Get current click count
naviiButton.isProcessing;      // Check if button is processing a click

// Manual initialization for dynamically added buttons:
const newButton = document.createElement('button');
newButton.className = 'navii-pulse-button';
document.body.appendChild(newButton);
new NaviiButton(newButton);
```

### Multiple Buttons

```html
<!-- All buttons with the class will automatically work -->
<div class="button-group">
    <button class="navii-pulse-button">
        <span class="button-text">OPTION 1</span>
        <span class="button-icon">🎯</span>
    </button>
    
    <button class="navii-pulse-button">
        <span class="button-text">OPTION 2</span>
        <span class="button-icon">⭐</span>
    </button>
    
    <button class="navii-pulse-button">
        <span class="button-text">OPTION 3</span>
        <span class="button-icon">🔥</span>
    </button>
</div>
```

## 🎨 Customization

### Colors
Modify the gradient in CSS:
```css
background: linear-gradient(135deg, #your-color1, #your-color2, #your-color3);
```

### Animation Speed
Adjust transition duration:
```css
transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
```

### Particle Count
Change particle amount in JavaScript:
```javascript
for (let i = 0; i < 6; i++) { // Change 6 to desired count
```

## 🛠️ Technical Details

- **CSS**: Advanced animations, custom properties, flexbox
- **JavaScript**: ES6 classes, event delegation, DOM manipulation  
- **HTML**: Semantic markup, accessibility features
- **Performance**: Optimized animations with GPU acceleration

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🤝 Contributing

Feel free to fork this project and submit improvements! This component is part of the ClickHub Hacktoberfest 2025 collection.

## 📄 License

MIT License - feel free to use in your projects!

---

Made with ❤️ by Navodhya Fernando for Hacktoberfest 2025
