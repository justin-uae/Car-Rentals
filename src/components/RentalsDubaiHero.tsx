import WhyChooseUs from './WhyChooseUs';
import HomeBanner from './HomeBanner';
import PopularTab from './PopularTab';

export default function RentalsDubaiHero() {
    return (
        <div className="min-h-screen bg-gray-50">
            <main>
                <HomeBanner />
                <PopularTab />
                <WhyChooseUs />
            </main>
        </div>
    );
}