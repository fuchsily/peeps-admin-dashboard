<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="login-page flex flex-center">
        <q-card flat bordered class="login-card">
          <q-card-section class="text-center q-pb-none">
            <div class="text-h3 text-weight-bold brand">peeps</div>
            <div class="text-h6 q-mt-md">Admin Dashboard</div>
            <div class="text-grey-7 q-mt-sm">Sign in to your account</div>
          </q-card-section>

          <q-card-section class="q-mt-lg">
            <q-form @submit="login">
              <q-input
                v-model="email"
                outlined
                type="email"
                label="Email"
                autocomplete="email"
                :rules="[(val) => !!val || 'Email is required']"
                class="q-mb-md"
              />

              <q-input
                v-model="password"
                outlined
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                autocomplete="current-password"
                :rules="[(val) => !!val || 'Password is required']"
              >
                <template #append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>

              <q-banner v-if="errorMessage" class="bg-red-1 text-negative rounded-borders q-mb-md">
                {{ errorMessage }}
              </q-banner>

              <q-btn
                type="submit"
                label="Sign in"
                unelevated
                no-caps
                class="full-width login-button q-mt-md"
                :loading="loading"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

const router = useRouter();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');

async function login() {
  loading.value = true;
  errorMessage.value = '';

  try {
    await signInWithEmailAndPassword(auth, email.value.trim(), password.value);

    const redirect = router.currentRoute.value.query.redirect;
    const destination =
      typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
        ? redirect
        : '/';

    await router.replace(destination);
  } catch {
    errorMessage.value = 'Login failed. Please check your credentials.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
@use '../css/variables' as *;

.login-page {
  min-height: 100vh;
  background: $background;
}

.login-card {
  width: 420px;
  max-width: calc(100vw - 32px);
  padding: $spacing-lg;
  background: $surface;
  border: 1px solid $border-color;
  border-radius: $radius-xl;
  box-shadow: $shadow-card;
}

.brand-logo {
  display: block;
  width: 180px;
  max-width: 100%;
  height: auto;
  object-fit: contain;
  margin: 0 auto;
}

.login-button {
  background: $primary-gradient;
  color: $text-primary;
  border-radius: $radius-pill;
  height: 44px;
  font-weight: 700;
}
</style>
