let score = 0;
        const image = document.getElementById('image');
        
        function changeScore(change) {
            score += change;
            document.getElementById('score').textContent = score;
            
            // Move the image up or down based on the change in score
            const currentMargin = parseFloat(getComputedStyle(image).marginTop);
            const newMargin = currentMargin +- (10 * change);
            image.style.marginTop = newMargin + 'px';
        }