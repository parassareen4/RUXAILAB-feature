<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-6">
          <v-card-title class="text-h5 text-center">
            Website Accessibility Checker
          </v-card-title>
          
          <v-card-text>
            <v-form @submit.prevent="startAnalysis" ref="form">
              <v-text-field
                v-model="url"
                label="Enter Website URL"
                :rules="urlRules"
                placeholder="https://example.com"
                prepend-icon="mdi-web"
                required
              />
              
              <v-btn
                block
                color="primary"
                :loading="loading"
                :disabled="!url"
                type="submit"
                class="mt-4"
              >
                Analyze Website
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'UrlInput',
  data: () => ({
    url: '',
    loading: false,
    urlRules: [
      v => !!v || 'URL is required',
      v => /^(http|https):\/\/[^ "]+$/.test(v) || 'Please enter a valid URL'
    ]
  }),
  methods: {
    async startAnalysis() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          // Navigate to loading page with URL
          this.$router.push({
            name: 'Loading',
            params: { url: this.url }
          })
        } catch (error) {
          console.error('Navigation error:', error)
          this.loading = false
        }
      }
    }
  }
}
</script> 