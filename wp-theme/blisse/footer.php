</main>

<!-- Footer -->
<footer class="site-footer">
    <div class="container">
        <div class="footer-widgets">
            <div class="footer-row" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px;">
                <div class="footer-col">
                    <div class="footer-logo">
                        <img src="<?php echo get_template_directory_uri(); ?>/images/blisse-logo-white.png" alt="Blisse" style="max-width: 150px; margin-bottom: 20px;">
                    </div>
                    <p style="color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.8;">
                        Blisse aitab Teil saavutada seatud eesmargid - vabanemine lisakilodest, tselluliidist voi lotvunud nahast.
                    </p>
                </div>

                <div class="footer-col">
                    <h4>Hooldused</h4>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li style="margin-bottom: 10px;"><a href="<?php echo home_url('/salongihooldused'); ?>">Salongihooldused</a></li>
                        <li style="margin-bottom: 10px;"><a href="<?php echo home_url('/hoolduste-paketid'); ?>">Hoolduste Paketid</a></li>
                        <li style="margin-bottom: 10px;"><a href="<?php echo home_url('/hinnakiri'); ?>">Hinnakiri</a></li>
                        <li style="margin-bottom: 10px;"><a href="<?php echo home_url('/pood'); ?>">Pood</a></li>
                    </ul>
                </div>

                <div class="footer-col">
                    <h4>Kiirlingid</h4>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li style="margin-bottom: 10px;"><a href="<?php echo home_url('/meist'); ?>">Meist</a></li>
                        <li style="margin-bottom: 10px;"><a href="<?php echo home_url('/galerii'); ?>">Galerii</a></li>
                        <li style="margin-bottom: 10px;"><a href="<?php echo home_url('/kontakt'); ?>">Kontakt</a></li>
                        <li style="margin-bottom: 10px;"><a href="<?php echo home_url('/minu-konto'); ?>">Minu Konto</a></li>
                    </ul>
                </div>

                <div class="footer-col">
                    <h4>Kontakt</h4>
                    <ul style="list-style: none; padding: 0; margin: 0; color: rgba(255,255,255,0.7);">
                        <li style="margin-bottom: 15px;">
                            <strong style="color: #fff;">Telefon:</strong><br>
                            <a href="tel:+3725151566">+372 515 1566</a>
                        </li>
                        <li style="margin-bottom: 15px;">
                            <strong style="color: #fff;">E-post:</strong><br>
                            <a href="mailto:info@blisse.ee">info@blisse.ee</a>
                        </li>
                        <li style="margin-bottom: 15px;">
                            <strong style="color: #fff;">Aadress:</strong><br>
                            Tallinn, Eesti
                        </li>
                    </ul>
                    <div class="social-links" style="margin-top: 20px;">
                        <a href="https://www.facebook.com/" target="_blank" style="margin-right: 15px; font-size: 20px;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                        </a>
                        <a href="https://www.instagram.com/kehastuudio_tallinnas/" target="_blank" style="font-size: 20px;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div class="copyright">
            <p>&copy; <?php echo date('Y'); ?> Blisse. Koik oigused kaitstud.</p>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
