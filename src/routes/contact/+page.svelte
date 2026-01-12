<script lang="ts">
  // No imports needed unless you want to handle form actions in +page.server.ts
</script>

<section class="min-h-screen flex flex-col items-center justify-center bg-gray-100 font-brand px-(--space-lg) py-(--space-xl)">
  <!-- Page Title -->
  <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-(--color-brand-primary) mb-(--space-md)">
    Contact Us
  </h1>
  <p class="text-lg text-gray-700 mb-(--space-lg) text-center max-w-xl">
    Have questions or want to learn more? Send us a message and we’ll get back to you.
  </p>

  <!-- Contact Form -->
   <!-- handle in +page.server.ts to send email -->
  <form
    method="post"
    action="/contact"  
    class="w-full max-w-lg bg-white rounded-lg shadow-md p-(--space-lg) space-y-(--space-md)"
  >
    <!-- Name -->
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
      <input
        type="text"
        id="name"
        name="name"
        required
        class="w-full rounded-md border-gray-300 focus:border-(--color-brand-primary) focus:ring-(--color-brand-primary)"
      />
    </div>

    <!-- Email -->
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        required
        class="w-full rounded-md border-gray-300 focus:border-(--color-brand-primary) focus:ring-(--color-brand-primary)"
      />
    </div>

    <!-- Message -->
    <div>
      <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Message</label>
      <textarea
        id="message"
        name="message"
        rows="5"
        required
        class="w-full rounded-md border-gray-300 focus:border-(--color-brand-primary) focus:ring-(--color-brand-primary)"
      ></textarea>
    </div>

    <!-- Submit -->
    <button
      type="submit"
      class="w-full btn btn-primary bg-(--color-brand-primary) text-(--color-brand-secondary) font-semibold py-2 px-4 rounded-md hover:opacity-90 transition"
    >
      Send Message
    </button>
  </form>
</section>
