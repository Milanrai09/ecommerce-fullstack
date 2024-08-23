const Footer = {
    render: async () => {
        const currentYear = new Date().getFullYear();
        return `
        <footer class="footer">
            <div class="footer-content">
                <div class="footer-section about">
                    <h3>About Us</h3>
                    <p>We're dedicated to providing quality products and exceptional service to our customers.</p>
                    <div class="social-icons">
                        <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
               
                <div class="footer-section contact">
                    <h3>Contact Us</h3>
                    <p><i class="fas fa-phone"></i> +1 (555) 123-4567</p>
                    <p><i class="fas fa-envelope"></i> support@yourecommerce.com</p>
                    <p><i class="fas fa-map-marker-alt"></i> 123 E-commerce St, Web City, 12345</p>
                </div>
                <div class="footer-section newsletter">
                    <h3>Newsletter</h3>
                    <p>Subscribe to our newsletter for updates and exclusive offers.</p>
                    <form id="newsletter-form">
                        <input type="email" placeholder="Enter your email" required>
                        <button type="submit">Subscribe</button>
                    </form>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${currentYear} Your E-commerce Site. All rights reserved.</p>
            </div>
        </footer>
        `;
    },

    after_render: async () => {
        document.getElementById('newsletter-form').addEventListener('submit', (e) => {
            e.preventDefault();
            // Handle newsletter subscription here
            console.log('Newsletter form submitted');
        });
    }
};

export default Footer;