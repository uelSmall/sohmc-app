<script>
  import logo from "$lib/assets/SOHMC-logo.jpg"; // update path if needed



  let darkMode = false;

  function toggleDarkMode() {
    darkMode = !darkMode;
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }


</script>

<div class="container space-y-8">
  <!-- Logo + Brand Identity -->
  <section class="flex items-center space-x-4">
    <img src={logo} alt="Sounds of Harmony Logo" class="h-16 w-auto" />
    <h1 class="text-[--color-brand-primary] font-brand text-3xl">
      Brand Style Guide
    </h1>
  </section>

  <!-- Color Swatches -->
  <section>
    <h2 class="text-xl font-bold mb-4">Colors</h2>
    <div class="grid grid-cols-4 gap-4">
      <div class="h-20 w-full bg-[--color-brand-primary] rounded text-white flex items-center justify-center font-bold">Primary</div>
      <div class="h-20 w-full bg-[--color-brand-secondary] rounded border flex items-center justify-center font-bold text-[--color-brand-black]">White</div>
      <div class="h-20 w-full bg-[--color-brand-black] rounded text-white flex items-center justify-center font-bold">Black</div>
      <div class="h-20 w-full bg-[--color-brand-gray] rounded text-white flex items-center justify-center font-bold">Gray</div>
    </div>
  </section>

  <!-- Typography -->
  <section class="space-y-4">
    <h2 class="text-xl font-bold mb-4">Typography</h2>
    <h1 class="text-4xl font-brand text-[--color-brand-primary]">Heading 1</h1>
    <h2 class="text-3xl font-brand text-[--color-brand-primary]">Heading 2</h2>
    <h3 class="text-2xl font-brand text-[--color-brand-primary]">Heading 3</h3>
    <p class="text-base text-[--color-brand-black]">
      Body text using brand black for strong readability and contrast.
    </p>
   <p class="text-muted italic">Muted text</p>
  </section>

  <!-- Buttons -->
  <section>
    <h2 class="text-xl font-bold mb-4">Buttons</h2>
    <button class="btn-primary">Primary Button</button>
  </section>

  <!-- Tags -->
  <section>
    <h2 class="text-xl font-bold mb-4">Tags</h2>
    <span class="tag">New</span>
    <span class="tag">Featured</span>
    <span class="tag">Sale</span>
  </section>

  <!-- Cards -->
  <section>
    <h2 class="text-xl font-bold mb-4">Cards</h2>
    <div class="card border border-[--color-brand-gray]">
      <h3 class="text-lg font-bold mb-2">Card Title</h3>
      <p>Card content styled with brand system.</p>
    </div>
  </section>
</div>

<section class="space-y-6">
  <h2 class="text-xl font-bold">Semantic Text Roles</h2>

  <p class="text-lead">
    Lead text — use for introductions or important summaries.
  </p>

  <p class="text-caption">
    Caption text — muted, secondary info or helper notes.
  </p>

  <p class="text-label">
    Label text — small uppercase for UI elements like form labels or badges.
  </p>
</section>

<section class="space-y-6">
  <h2 class="text-xl font-bold">Alerts & Feedback States</h2>

  <div class="alert alert-success">✅ Success: Your action was completed successfully.</div>
  <div class="alert alert-error">❌ Error: Something went wrong, please try again.</div>
  <div class="alert alert-warning">⚠️ Warning: Check your input before proceeding.</div>
  <div class="alert alert-info">ℹ️ Info: This is additional context for the user.</div>
</section>

<section class="space-y-6">
  <h2 class="text-xl font-bold">Buttons</h2>

  <div class="flex gap-4 flex-wrap">
    <button class="btn btn-primary">Primary</button>
    <button class="btn btn-success">Success</button>
    <button class="btn btn-error">Error</button>
    <button class="btn btn-warning">Warning</button>
    <button class="btn btn-info">Info</button>
  </div>
</section>

<section class="space-y-6">
  <h2 class="text-xl font-bold">Form Elements</h2>

  <div class="space-y-4">
    <!-- Input -->
    <label class="form-label" for="name">Name</label>
    <input id="name" type="text" class="form-input" placeholder="Enter your name" />
    <p class="form-helper">Helper text using brand gray.</p>

    <!-- Select -->
    <label class="form-label" for="role">Role</label>
    <select id="role" class="form-select">
      <option>Student</option>
      <option>Teacher</option>
      <option>Musician</option>
    </select>

    <!-- Textarea -->
    <label class="form-label" for="message">Message</label>
    <textarea id="message" rows="4" class="form-textarea" placeholder="Write your message..."></textarea>

    <!-- Feedback -->
    <p class="form-error">❌ Error: Please fill out this field.</p>
    <p class="form-success">✅ Success: Your input looks good!</p>
  </div>
</section>


<section class="space-y-6">
  <h2 class="text-xl font-bold">Dark Mode Preview</h2>

  <div class="card">
    <h3 class="text-lg font-bold mb-2">Card Title</h3>
    <p>Card content styled with brand system.</p>
  </div>

  <button class="btn btn-primary">Primary Button</button>
  <p class="text-muted italic">Muted text adapts automatically.</p>
</section>


<button class="btn btn-info" on:click={toggleDarkMode}>
  {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
</button>
<section class="space-y-6">
  <h2 class="text-xl font-bold">Theme Toggle</h2>
  <button class="btn btn-info" on:click={toggleDarkMode}>
    Toggle Dark Mode
  </button>

  <div class="card mt-4">
    <h3 class="text-lg font-bold mb-2">Preview</h3>
    <p class="text-muted italic">This card adapts when you toggle themes.</p>
  </div>
</section>

<div class="container space-y-8">
  <section class="text-center space-y-4">
    <img src="{logo}" alt="SOHMC Logo" class="mx-auto h-20 w-auto" />
 <h1 class="text-4xl font-brand text-[#950078] font-bold">
  Brand Style Guide
</h1>
<h1 class="text-4xl font-brand text-(--color-brand-primary) font-bold">
  Brand Style Guide
</h1>

    <p class="text-caption">Caption text using brand gray.</p>
  </section>
</div>


