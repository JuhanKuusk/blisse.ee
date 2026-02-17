-- Blisse.ee Supabase Schema
-- Hoolduste ja pakettide andmebaas
-- Kasutab "blisse_" prefiksit, et eraldada teistest tabelitest

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- BLISSE_TREATMENTS (Hooldused) Table
-- ============================================
CREATE TABLE IF NOT EXISTS blisse_treatments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    trial_price DECIMAL(10,2),
    duration VARCHAR(50),
    image_url VARCHAR(500),
    benefits TEXT[], -- Array of benefit strings
    sessions VARCHAR(50), -- e.g., "5-10 seanssi"
    min_age INTEGER,
    category VARCHAR(50) NOT NULL, -- 'kehahooldused' or 'naohooldused'
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- BLISSE_PACKAGES (Paketid) Table
-- ============================================
CREATE TABLE IF NOT EXISTS blisse_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    regular_price DECIMAL(10,2), -- Original price before discount
    duration VARCHAR(50), -- e.g., "3-4 kuud"
    image_url VARCHAR(500),
    includes TEXT[], -- Array of included items
    category VARCHAR(50) NOT NULL, -- 'small', 'medium', 'large'
    is_highlighted BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- BLISSE_BOOKINGS (Broneeringud) Table
-- ============================================
CREATE TABLE IF NOT EXISTS blisse_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    treatment_id UUID REFERENCES blisse_treatments(id),
    package_id UUID REFERENCES blisse_packages(id),
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(200) NOT NULL,
    customer_phone VARCHAR(50),
    preferred_date TIMESTAMP WITH TIME ZONE,
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled, completed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Indexes for better performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_blisse_treatments_category ON blisse_treatments(category);
CREATE INDEX IF NOT EXISTS idx_blisse_treatments_active ON blisse_treatments(is_active);
CREATE INDEX IF NOT EXISTS idx_blisse_packages_category ON blisse_packages(category);
CREATE INDEX IF NOT EXISTS idx_blisse_packages_active ON blisse_packages(is_active);
CREATE INDEX IF NOT EXISTS idx_blisse_bookings_status ON blisse_bookings(status);

-- ============================================
-- Updated_at trigger function
-- ============================================
CREATE OR REPLACE FUNCTION blisse_update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
DROP TRIGGER IF EXISTS update_blisse_treatments_updated_at ON blisse_treatments;
CREATE TRIGGER update_blisse_treatments_updated_at
    BEFORE UPDATE ON blisse_treatments
    FOR EACH ROW
    EXECUTE FUNCTION blisse_update_updated_at_column();

DROP TRIGGER IF EXISTS update_blisse_packages_updated_at ON blisse_packages;
CREATE TRIGGER update_blisse_packages_updated_at
    BEFORE UPDATE ON blisse_packages
    FOR EACH ROW
    EXECUTE FUNCTION blisse_update_updated_at_column();

DROP TRIGGER IF EXISTS update_blisse_bookings_updated_at ON blisse_bookings;
CREATE TRIGGER update_blisse_bookings_updated_at
    BEFORE UPDATE ON blisse_bookings
    FOR EACH ROW
    EXECUTE FUNCTION blisse_update_updated_at_column();

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE blisse_treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blisse_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blisse_bookings ENABLE ROW LEVEL SECURITY;

-- Public read access for treatments and packages
DROP POLICY IF EXISTS "Allow public read access to blisse_treatments" ON blisse_treatments;
CREATE POLICY "Allow public read access to blisse_treatments"
    ON blisse_treatments FOR SELECT
    USING (is_active = true);

DROP POLICY IF EXISTS "Allow public read access to blisse_packages" ON blisse_packages;
CREATE POLICY "Allow public read access to blisse_packages"
    ON blisse_packages FOR SELECT
    USING (is_active = true);

-- Only authenticated users can insert bookings
DROP POLICY IF EXISTS "Allow public to create blisse_bookings" ON blisse_bookings;
CREATE POLICY "Allow public to create blisse_bookings"
    ON blisse_bookings FOR INSERT
    WITH CHECK (true);

-- ============================================
-- SEED DATA - Kehahooldused
-- ============================================
INSERT INTO blisse_treatments (slug, name, description, price, trial_price, duration, image_url, benefits, sessions, category, display_order) VALUES
('lpg-massaaz', 'LPG Massaaž', 'LPG massaaž on tõhus meetod tselluliidi vähendamiseks ja naha pinguldamiseks. Mehhaaniline vakuummassaaž stimuleerib vereringet ja lümfivoolu.', 79, 29, '60 min', 'images/treatments/lpg-massage.jpg', ARRAY['Tselluliidi vähendamine', 'Naha pinguldamine', 'Vereringe parandamine', 'Lümfivoolu stimuleerimine'], '5-10 seanssi', 'kehahooldused', 1),
('kruolipoluus', 'Krüolipolüüs', 'Krüolipolüüs on mitteinvasiivne rasvakoe külmutamise meetod. Rasvarakud hävitatakse kontrollitud külmaga ilma operatsioonita.', 99, 59, '45-60 min', 'images/treatments/cryolipolysis.jpg', ARRAY['Lokaalne rasvapõletus', 'Püsiv tulemus', 'Valutu protseduur', 'Taastusaeg puudub'], '1-3 seanssi', 'kehahooldused', 2),
('reshape-therapy', 'ReShape Teraapia', 'ReShape teraapia kombineerib mikrovibratsioonid kolme tehnoloogiaga nahatoonuse ja kehakontuuri parandamiseks.', 33, NULL, '30-45 min', 'images/treatments/hero-model-1.jpg', ARRAY['Naha toonuse parandamine', 'Tselluliidi vähendamine', 'Sünnitusjärgne taastumine', 'Kehakontuuri modelleerimine'], '5-8 seanssi', 'kehahooldused', 3),
('cold-lipo', 'Cold Lipo Laser', 'Cold Lipo Laser kasutab madala taseme laserkiirgust rasvakudede lagundamiseks ja ainevahetuse kiirendamiseks.', 79, NULL, '30-45 min', 'images/treatments/hero-model-2.jpg', ARRAY['Rasvakoe vähendamine', 'Ainevahetuse kiirendamine', 'Mitteinvasiivne', 'Kiire protseduur'], '3-6 seanssi', 'kehahooldused', 4),
('kavitatsioon', 'Kavitatsioon', 'Kavitatsioon on ultrahelipõhine meetod, mis tekitab mikromulle rasvakoes, aidates lagundada rasvarakke.', 69, NULL, '30-45 min', 'images/treatments/hero-model-3.jpg', ARRAY['Rasvakoe lagundamine', 'Tselluliidi vähendamine', 'Valutu protseduur', 'Kohene tulemus'], '4-8 seanssi', 'kehahooldused', 5)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SEED DATA - Näohooldused
-- ============================================
INSERT INTO blisse_treatments (slug, name, description, price, trial_price, duration, image_url, benefits, sessions, min_age, category, display_order) VALUES
('rf-lifting-naole', 'RF Lifting Näole', 'RF lifting kasutab raadiosagedusenergiat kollageeni tootmise stimuleerimiseks ja naha pinguldamiseks.', 79, NULL, '45-60 min', 'images/gallery/1.jpg', ARRAY['Kortsude vähendamine', 'Naha pinguldamine', 'Kollageeni tootmine', 'Näo kontuuri parandamine'], '6-8 seanssi', 30, 'naohooldused', 1),
('prestige-reshapelift', 'Prestige ReShapeLift Näohooldus', 'Premium näohooldus, mis kombineerib mitut tehnoloogiat sügavaks naha noorendamiseks ja liftinguks.', 99, NULL, '60-75 min', 'images/gallery/2.jpg', ARRAY['Sügav noorendamine', 'Näo modelleerimine', 'Kortsude silumine', 'Naha elastsuse parandamine'], '4-6 seanssi', 35, 'naohooldused', 2),
('kruolipoluus-naole', 'Krüolipolüüs Näole', 'Näole kohandatud krüolipolüüs topeltlõua ja näokontuuride korrigeerimiseks.', 79, NULL, '30-45 min', 'images/gallery/3.jpg', ARRAY['Topeltlõua vähendamine', 'Näokontuuri parandamine', 'Püsiv tulemus', 'Mitteinvasiivne'], '2-4 seanssi', NULL, 'naohooldused', 3),
('hifu-ultraheli-lifting', 'HIFU Ultraheli Lifting', 'Kõrge intensiivsusega fokuseeritud ultraheli sügavaks naha tõstmiseks ja pinguldamiseks.', 199, NULL, '60-90 min', 'images/gallery/4.jpg', ARRAY['Sügav lifting', 'Pikaajaline tulemus', 'Naha pinguldamine', 'Kollageeni tootmine'], '1-2 seanssi', 35, 'naohooldused', 4),
('lpg-naohooldus', 'LPG Näohooldus', 'LPG tehnoloogia näole - suurendab vereringet, parandab nahatoonust ja vähendab turset.', 69, NULL, '30-45 min', 'images/gallery/5.jpg', ARRAY['Naha toonuse parandamine', 'Turse vähendamine', 'Vereringe parandamine', 'Näo värskendamine'], '5-8 seanssi', NULL, 'naohooldused', 5),
('hammaste-valgendamine', 'Hammaste Valgendamine', 'Professionaalne hammaste valgendamine LED-valguse ja spetsiaalse geeli abil.', 99, NULL, '60 min', 'images/gallery/6.jpg', ARRAY['Heledamad hambad', 'Kiire tulemus', 'Ohutu protseduur', 'Pikaajaline efekt'], '1 seanss', NULL, 'naohooldused', 6)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SEED DATA - Paketid (Small)
-- ============================================
INSERT INTO blisse_packages (slug, name, description, price, regular_price, duration, image_url, includes, category, display_order) VALUES
('lpg-massaaz-5x', 'LPG Massaaž 5x', 'Viie LPG massaaži pakett tselluliidi ja kehakontuuri parandamiseks.', 149, 395, '3-4 nädalat', 'images/treatments/lpg-massage.jpg', ARRAY['5x LPG massaaž', 'Konsultatsioon', 'Individuaalne plaan'], 'small', 1),
('topeltmoju', 'Topeltmõju 5x LPG + 5x ReShape', 'Kombineeritud pakett maksimaalse tulemuse saavutamiseks - LPG ja ReShape teraapia koos.', 249, 560, '5-6 nädalat', 'images/treatments/hero-model-1.jpg', ARRAY['5x LPG massaaž', '5x ReShape teraapia', 'Konsultatsioon'], 'small', 2),
('cold-lipo-kruo-kombo', 'Cold Lipo + Krüo Kombo', 'Kahe võimsa rasvapõletustehnoloogia kombinatsioon kiireks tulemuseks.', 199, 356, '4-6 nädalat', 'images/treatments/cryolipolysis.jpg', ARRAY['2x Cold Lipo Laser', '2x Krüolipolüüs', 'Konsultatsioon'], 'small', 3)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SEED DATA - Paketid (Medium)
-- ============================================
INSERT INTO blisse_packages (slug, name, description, price, regular_price, duration, image_url, includes, category, display_order) VALUES
('lpg-massaaz-10x', 'LPG Massaaž 10x', 'Kümne LPG massaaži pakett tugevamate tulemuste saavutamiseks.', 299, 790, '5-6 nädalat', 'images/treatments/lpg-massage.jpg', ARRAY['10x LPG massaaž', 'Konsultatsioon', 'Toitumissoovitused'], 'medium', 1),
('talvekombo', 'Talvekombo', 'Täielik kehahoolduspakett talveks - LPG, krüolipolüüs ja ReShape teraapia.', 399, 725, '6-8 nädalat', 'images/packages/superhooldus.jpg', ARRAY['5x LPG massaaž', '2x Krüolipolüüs', '8x ReShape teraapia'], 'medium', 2),
('best-body-combo', 'Best Body Combo', 'Parim kehakontuuri pakett - mitme tehnoloogia kombinatsioon ideaalse tulemuse saavutamiseks.', 349, 630, '6-8 nädalat', 'images/treatments/hero-model-2.jpg', ARRAY['4x LPG massaaž', '2x Krüolipolüüs', '6x ReShape teraapia'], 'medium', 3),
('kiirsalenemine', 'Kiirsalenemine', 'Intensiivne pakett kiireks kaalulanguseks ja kehakontuuri parandamiseks.', 359, 700, '6-8 nädalat', 'images/treatments/hero-model-3.jpg', ARRAY['Cold Lipo Laser', 'Kavitatsioon', 'Krüolipolüüs', 'LPG massaaž'], 'medium', 4),
('naohooldus-pakett', '5x LPG Näohooldus + 5x ReShape Näole', 'Kompleksne näohoolduspakett naha noorendamiseks ja kontuuri parandamiseks.', 349, 510, '5-6 nädalat', 'images/gallery/1.jpg', ARRAY['5x LPG näohooldus', '5x ReShape näole', 'Konsultatsioon'], 'medium', 5),
('taiuslik-naokontuuri', 'Täiuslik Näokontuurimine', 'Premium pakett näokontuuride modelleerimiseks ja naha pinguldamiseks.', 299, 475, '4-6 nädalat', 'images/gallery/2.jpg', ARRAY['4x RF Lifting', '2x Krüolipolüüs näole', 'Konsultatsioon'], 'medium', 6)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SEED DATA - Paketid (Large)
-- ============================================
INSERT INTO blisse_packages (slug, name, description, price, regular_price, duration, image_url, includes, category, is_highlighted, display_order) VALUES
('mega40', 'MEGA40 Kehahoolduspakett', 'Meie kõige populaarsem pakett - 40 protseduuri uskumatult soodsa hinnaga! Vali ise hooldused vastavalt oma vajadustele.', 525, 1800, '3-4 kuud', 'images/packages/mega40.jpg', ARRAY['2x Krüolipolüüs', '10x LPG massaaž', '2x ReShape teraapia', '26x vabalt valitav hooldus'], 'large', true, 1),
('rasvapoletuse-superpakett', 'Rasvapõletuse Superpakett', 'Maksimaalne rasvapõletus mitme tehnoloogia kombinatsiooniga.', 599, 1250, '2-3 kuud', 'images/treatments/cryolipolysis.jpg', ARRAY['5x Krüolipolüüs', '10x LPG massaaž', '5x Cold Lipo Laser', '5x Kavitatsioon'], 'large', false, 2),
('kolmetunnine-superhooldus', 'Kolmetunnine Superhooldus', 'Intensiivne kolmetunnine hooldus, mis kombineerib mitut tehnoloogiat ühes seanssis.', 199, 350, '3 tundi', 'images/packages/superhooldus.jpg', ARRAY['Krüolipolüüs', 'LPG massaaž', 'ReShape teraapia', 'Cold Lipo Laser'], 'large', false, 3)
ON CONFLICT (slug) DO NOTHING;
