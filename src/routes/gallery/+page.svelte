<script lang="ts">
  // Placeholder images — replace with your actual gallery assets
  const images = [
    "/gallery1.jpg",
    "/gallery2.jpg",
    "/gallery3.jpg",
    "/gallery4.jpg",
    "/gallery5.jpg"
  ];

  let current = 0;

  function next() {
    current = (current + 1) % images.length;
  }

  function prev() {
    current = (current - 1 + images.length) % images.length;
  }
</script>

<section class="min-h-screen bg-gray-100 font-brand px-(--space-lg) py-(--space-xl)">
  <!-- Page Title -->
  <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-(--color-brand-primary) text-center mb-(--space-lg)">
    Gallery
  </h1>

  <!-- Slider -->
  <div class="relative max-w-4xl mx-auto">
    <!-- Image -->
    <img
      src={images[current]}
      alt=""
      class="w-full h-80 sm:h-112 object-cover rounded-lg shadow-md transition-all duration-500"
    />

    <!-- Controls -->
    <button
      on:click={prev}
      class="absolute top-1/2 left-4 -translate-y-1/2 bg-(--color-brand-primary) text-(--color-brand-secondary) rounded-full p-2 shadow hover:opacity-90 transition"
    >
      ‹
    </button>
    <button
      on:click={next}
      class="absolute top-1/2 right-4 -translate-y-1/2 bg-(--color-brand-primary) text-(--color-brand-secondary) rounded-full p-2 shadow hover:opacity-90 transition"
    >
      ›
    </button>
  </div>

  <!-- Thumbnails -->
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-(--space-md) mt-(--space-lg) max-w-4xl mx-auto">
    {#each images as img, i}
      <button
        type="button"
        on:click={() => (current = i)}
        class="cursor-pointer rounded-md shadow-md overflow-hidden border-2 {i === current ? 'border-(--color-brand-primary)' : 'border-transparent'} transition hover:opacity-90"
      >
        <img
          src={img}
          alt="Thumbnail {i + 1}"
          class="object-cover h-24 w-full"
        />
      </button>
    {/each}
  </div>
</section>
