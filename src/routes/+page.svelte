<script lang="ts">
  import img from '$lib/assets/SOHMC-logo.jpg';
</script>

<!-- Hero Section with Background Image -->
<section class="relative min-h-screen flex items-center justify-center text-center text-white font-brand">
  <!-- Background image -->
  <img src={img} alt="Background" class="absolute inset-0 w-full h-full object-cover" />
  <!-- Overlay -->
<div class="absolute inset-0" style="background-color: rgba(98,102,108,0.4);"></div>
  
</section>

<!-- About Section -->
<section class="px-(--space-lg) py-(--space-xl) text-center">
  <h2 class="text-3xl font-bold mb-(--space-md)">About Us</h2>
  <p class="max-w-2xl mx-auto text-lg">
    At SOHMC, we believe music is the language of harmony. Our centre nurtures talent and fosters creativity for all ages.
  </p>
</section>

<!-- Highlights Section -->
<section class="px-(--space-lg) py-(--space-xl) bg-gray-50">
  <h2 class="text-3xl font-bold text-center mb-(--space-lg)">What We Offer</h2>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-(--space-md) text-center">
    <div class="p-6 bg-white rounded-lg shadow-md">
      <h3 class="text-xl font-semibold mb-2">Music Classes</h3>
      <p class="text-sm">Learn instruments, theory, and performance with expert guidance.</p>
    </div>
    <div class="p-6 bg-white rounded-lg shadow-md">
      <h3 class="text-xl font-semibold mb-2">Teacher Resources</h3>
      <p class="text-sm">Modern tools for lesson planning, uploads, and collaboration.</p>
    </div>
    <div class="p-6 bg-white rounded-lg shadow-md">
      <h3 class="text-xl font-semibold mb-2">Community Events</h3>
      <p class="text-sm">Concerts, recitals, and workshops to showcase talent.</p>
    </div>
  </div>
</section>

<!-- Gallery Section -->
<section class="px-(--space-lg) py-(--space-xl)">
  <h2 class="text-3xl font-bold text-center mb-(--space-lg)">Our Gallery</h2>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-(--space-md)">
    <img src="/gallery1.jpg" alt="Performance" class="rounded-lg shadow-md" />
    <img src="/gallery2.jpg" alt="Students" class="rounded-lg shadow-md" />
    <img src="/gallery3.jpg" alt="Instruments" class="rounded-lg shadow-md" />
  </div>
</section>

<!-- Footer -->
<footer class="px-(--space-lg) py-(--space-md) bg-(--color-brand-primary) text-gray-300 text-center">
  <p>&copy; {new Date().getFullYear()} Sounds of Harmony Music Centre. All rights reserved.</p>
  <div class="flex justify-center gap-4 mt-2">
    <a href="https://facebook.com" target="_blank" class="hover:text-white">Facebook</a>
    <a href="https://instagram.com" target="_blank" class="hover:text-white">Instagram</a>
    <a href="https://youtube.com" target="_blank" class="hover:text-white">YouTube</a>
  </div>
</footer>
