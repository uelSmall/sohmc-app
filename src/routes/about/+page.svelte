<script lang="ts">
  import aboutImage from '$lib/assets/SOHMC-about.png';
</script>

<!-- Hero / Title -->
<section class="flex flex-col items-center justify-center text-center min-h-[60vh] bg-gray-500/40 font-brand px-(--space-lg) py-(--space-xl)">
  <img src={aboutImage} alt="SOHMC About" class="h-24 sm:h-32 md:h-40 w-auto mb-(--space-md)" />
  <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-(--color-brand-primary)">
    Sounds of Harmony Music Centre: Celebrating 15 Years of Musical Excellence
  </h1>
</section>

<!-- Commitment -->
<section class="px-(--space-lg) py-(--space-xl) text-center max-w-4xl mx-auto">
  <h2 class="text-2xl font-semibold mb-(--space-md)">Our Commitment to Excellence</h2>
  <p class="text-lg text-gray-700">
    At SOHMC, we cultivate a lifelong love for music. Our faculty includes accomplished musicians who are not only masters of their craft but also passionate educators. They work closely with each student to build confidence, refine technique, and unlock creative potential.
  </p>
</section>

<!-- Programs -->
<section class="px-(--space-lg) py-(--space-xl) bg-gray-50">
  <h2 class="text-2xl font-semibold text-center mb-(--space-md)">Programs That Inspire</h2>
  <ul class="grid grid-cols-1 md:grid-cols-2 gap-(--space-md) max-w-3xl mx-auto text-lg text-gray-700">
    <li>🎹 Instrumental lessons (piano, guitar, violin, and more)</li>
    <li>🎤 Vocal training and performance coaching</li>
    <li>📖 Music theory, composition, and ear training</li>
    <li>🎧 Music production and recording techniques</li>
  </ul>
</section>

<!-- Facilities -->
<section class="px-(--space-lg) py-(--space-xl) text-center max-w-4xl mx-auto">
  <h2 class="text-2xl font-semibold mb-(--space-md)">Facilities That Empower</h2>
  <ul class="space-y-2 text-lg text-gray-700">
    <li>• Professionally equipped practice rooms</li>
    <li>• Full-featured recording studio</li>
    <li>• Music library and resource centre</li>
  </ul>
</section>

<!-- Community -->
<section class="px-(--space-lg) py-(--space-xl) bg-gray-50 text-center max-w-4xl mx-auto">
  <h2 class="text-2xl font-semibold mb-(--space-md)">Community and Connection</h2>
  <p class="text-lg text-gray-700">
    SOHMC is deeply rooted in the local community. Through outreach programs, concerts, and student showcases, we promote music appreciation and provide platforms for emerging talent to shine.
  </p>
</section>

<!-- Success -->
<section class="px-(--space-lg) py-(--space-xl) text-center max-w-4xl mx-auto">
  <h2 class="text-2xl font-semibold mb-(--space-md)">A Legacy of Success</h2>
  <p class="text-lg text-gray-700">
    Our alumni include professional musicians, educators, and creative leaders across the music industry. Their achievements reflect the centre’s commitment to excellence and its role in shaping the future of music in the region.
  </p>
</section>

<!-- Call to Action -->
<section class="px-(--space-lg) py-(--space-xl) bg-(--color-brand-primary) text-(--color-brand-secondary) text-center">
  <h2 class="text-2xl font-semibold mb-(--space-md)">Begin Your Journey</h2>
  <p class="text-lg max-w-2xl mx-auto mb-(--space-md)">
    Whether you're picking up an instrument for the first time or refining your artistry, Sounds of Harmony Music Centre is the perfect place to start — or continue — your musical journey.
  </p>
  <a href="/auth/signup" class="btn btn-info">Join Us Today</a>
</section>
