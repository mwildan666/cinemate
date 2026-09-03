import Hero from '../components/Hero';

const HomePage = () => {
  return (
    <div className='space-y-8'>
      <Hero />

      <div className='space-y-8 px-4 pb-4'>
        <section>
          <h2 className='text-xl font-bold mb-2'>Now Playing</h2>
          {/* row of movie cards */}
        </section>
        <section>
          <h2 className='text-xl font-bold mb-2'>Popular</h2>
          {/* row of movie cards */}
        </section>
        <section>
          <h2 className='text-xl font-bold mb-2'>Top Rated</h2>
          {/* row of movie cards */}
        </section>
        <section>
          <h2 className='text-xl font-bold mb-2'>Upcoming</h2>
          {/* row of movie cards */}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
