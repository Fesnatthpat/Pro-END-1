<template>
    <div class="min-h-screen flex flex-col bg-white">
        <layoutNavbar />

        <main class="flex-grow container mx-auto px-4 py-8">
            <slot />
        </main>

        <layoutFooter />
    </div>
</template>