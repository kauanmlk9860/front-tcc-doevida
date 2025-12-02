# Guia para Exibir Imagens no Android Studio

Este guia mostra como exibir as imagens dos hospitais no seu aplicativo Android.

## 1. Adicionar Dependências

No arquivo `build.gradle` (Module: app), adicione:

```gradle
dependencies {
    // ... outras dependências
    
    // Glide - biblioteca para carregar imagens
    implementation 'com.github.bumptech.glide:glide:4.16.0'
    annotationProcessor 'com.github.bumptech.glide:compiler:4.16.0'
}
```

Ou se preferir Coil (mais moderno e Kotlin-first):

```gradle
dependencies {
    // Coil
    implementation 'io.coil-kt:coil:2.5.0'
}
```

## 2. Adicionar Permissão de Internet

No `AndroidManifest.xml`:

```xml
<manifest ...>
    <uses-permission android:name="android.permission.INTERNET" />
    
    <application
        android:usesCleartextTraffic="true"
        ...>
        <!-- ... -->
    </application>
</manifest>
```

**Importante**: `android:usesCleartextTraffic="true"` permite conexões HTTP no emulador (apenas para desenvolvimento).

## 3. Configuração da URL Base

Crie uma classe para gerenciar as configurações da API:

```kotlin
// ApiConfig.kt
object ApiConfig {
    // Para emulador Android: 10.0.2.2 aponta para localhost da máquina host
    // Para dispositivo físico: use o IP da sua máquina (ex: 192.168.1.100)
    private const val BASE_URL = "http://10.0.2.2:8080"
    private const val API_PATH = "/v1/doevida"
    
    val API_URL = "$BASE_URL$API_PATH"
    
    /**
     * Converte um caminho relativo de imagem para URL completa
     * Exemplo: "/uploads/hospital-123.jpg" -> "http://10.0.2.2:8080/uploads/hospital-123.jpg"
     */
    fun getImageUrl(path: String?): String? {
        if (path.isNullOrBlank()) return null
        
        return when {
            path.startsWith("http://") || path.startsWith("https://") -> path
            path.startsWith("/") -> "$BASE_URL$path"
            else -> "$BASE_URL/$path"
        }
    }
}
```

## 4. Model do Hospital

```kotlin
// Hospital.kt
data class Hospital(
    val id: Int,
    val nome: String,
    val email: String,
    val cnpj: String,
    val telefone: String,
    val cep: String,
    val capacidade_maxima: Int,
    val convenios: String,
    val crm: String,
    val horario_abertura: String,
    val horario_fechamento: String,
    val foto: String?, // URL relativa: "/uploads/hospital-123.jpg"
    val criado_em: String
) {
    /**
     * Retorna a URL completa da foto
     */
    fun getFotoUrl(): String? {
        return ApiConfig.getImageUrl(foto)
    }
}
```

## 5. Carregar Imagem com Glide

```kotlin
import android.widget.ImageView
import com.bumptech.glide.Glide
import com.bumptech.glide.load.engine.DiskCacheStrategy

fun ImageView.loadHospitalPhoto(hospital: Hospital?) {
    val photoUrl = hospital?.getFotoUrl()
    
    Glide.with(this.context)
        .load(photoUrl)
        .placeholder(R.drawable.placeholder_hospital) // Imagem de placeholder
        .error(R.drawable.error_hospital) // Imagem de erro
        .diskCacheStrategy(DiskCacheStrategy.ALL)
        .into(this)
}

// Uso:
imageViewHospital.loadHospitalPhoto(hospital)
```

## 6. Carregar Imagem com Coil (Alternativa)

```kotlin
import coil.load
import coil.transform.RoundedCornersTransformation

fun ImageView.loadHospitalPhoto(hospital: Hospital?) {
    val photoUrl = hospital?.getFotoUrl()
    
    this.load(photoUrl) {
        placeholder(R.drawable.placeholder_hospital)
        error(R.drawable.error_hospital)
        crossfade(true)
        transformations(RoundedCornersTransformation(16f))
    }
}
```

## 7. Exemplo de Adapter para RecyclerView

```kotlin
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide

class HospitalAdapter(
    private var hospitais: List<Hospital>,
    private val onItemClick: (Hospital) -> Unit
) : RecyclerView.Adapter<HospitalAdapter.HospitalViewHolder>() {

    class HospitalViewHolder(private val binding: ItemHospitalBinding) :
        RecyclerView.ViewHolder(binding.root) {
        
        fun bind(hospital: Hospital, onItemClick: (Hospital) -> Unit) {
            binding.textNome.text = hospital.nome
            binding.textEndereco.text = hospital.cep
            binding.textTelefone.text = hospital.telefone
            
            // Carregar foto
            val fotoUrl = hospital.getFotoUrl()
            Glide.with(binding.root.context)
                .load(fotoUrl)
                .placeholder(R.drawable.placeholder_hospital)
                .error(R.drawable.ic_hospital_default)
                .centerCrop()
                .into(binding.imageHospital)
            
            binding.root.setOnClickListener { onItemClick(hospital) }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): HospitalViewHolder {
        val binding = ItemHospitalBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return HospitalViewHolder(binding)
    }

    override fun onBindViewHolder(holder: HospitalViewHolder, position: Int) {
        holder.bind(hospitais[position], onItemClick)
    }

    override fun getItemCount() = hospitais.size

    fun updateHospitais(newHospitais: List<Hospital>) {
        hospitais = newHospitais
        notifyDataSetChanged()
    }
}
```

## 8. Layout XML

```xml
<!-- item_hospital.xml -->
<androidx.cardview.widget.CardView
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_margin="8dp"
    app:cardCornerRadius="12dp"
    app:cardElevation="4dp">

    <androidx.constraintlayout.widget.ConstraintLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:padding="16dp">

        <ImageView
            android:id="@+id/imageHospital"
            android:layout_width="80dp"
            android:layout_height="80dp"
            android:scaleType="centerCrop"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toTopOf="parent"
            android:contentDescription="Foto do hospital" />

        <TextView
            android:id="@+id/textNome"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_marginStart="16dp"
            android:textSize="18sp"
            android:textStyle="bold"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toEndOf="@id/imageHospital"
            app:layout_constraintTop_toTopOf="parent" />

        <TextView
            android:id="@+id/textEndereco"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_marginStart="16dp"
            android:layout_marginTop="8dp"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toEndOf="@id/imageHospital"
            app:layout_constraintTop_toBottomOf="@id/textNome" />

        <TextView
            android:id="@+id/textTelefone"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_marginStart="16dp"
            android:layout_marginTop="4dp"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toEndOf="@id/imageHospital"
            app:layout_constraintTop_toBottomOf="@id/textEndereco" />

    </androidx.constraintlayout.widget.ConstraintLayout>
</androidx.cardview.widget.CardView>
```

## 9. Retrofit Service (para buscar hospitais)

```kotlin
import retrofit2.http.GET
import retrofit2.Response

interface ApiService {
    @GET("hospital")
    suspend fun getHospitais(): Response<HospitaisResponse>
}

data class HospitaisResponse(
    val status: Boolean,
    val hospitais: List<Hospital>
)
```

## 10. ViewModel

```kotlin
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class HospitalViewModel(private val repository: HospitalRepository) : ViewModel() {
    
    private val _hospitais = MutableStateFlow<List<Hospital>>(emptyList())
    val hospitais: StateFlow<List<Hospital>> = _hospitais
    
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading
    
    fun carregarHospitais() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val response = repository.getHospitais()
                if (response.isSuccessful) {
                    _hospitais.value = response.body()?.hospitais ?: emptyList()
                }
            } catch (e: Exception) {
                // Tratar erro
            } finally {
                _isLoading.value = false
            }
        }
    }
}
```

## 11. Activity/Fragment

```kotlin
class HospitaisActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityHospitaisBinding
    private lateinit var adapter: HospitalAdapter
    private lateinit var viewModel: HospitalViewModel
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHospitaisBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupRecyclerView()
        setupObservers()
        
        viewModel.carregarHospitais()
    }
    
    private fun setupRecyclerView() {
        adapter = HospitalAdapter(emptyList()) { hospital ->
            // Clique no item
            val intent = Intent(this, HospitalDetalhesActivity::class.java)
            intent.putExtra("HOSPITAL_ID", hospital.id)
            startActivity(intent)
        }
        
        binding.recyclerViewHospitais.apply {
            layoutManager = LinearLayoutManager(this@HospitaisActivity)
            adapter = this@HospitaisActivity.adapter
        }
    }
    
    private fun setupObservers() {
        lifecycleScope.launch {
            viewModel.hospitais.collect { hospitais ->
                adapter.updateHospitais(hospitais)
            }
        }
        
        lifecycleScope.launch {
            viewModel.isLoading.collect { isLoading ->
                binding.progressBar.isVisible = isLoading
            }
        }
    }
}
```

## 12. Testando

### No Emulador:
- URL do backend: `http://10.0.2.2:8080/v1/doevida`
- URL das imagens: `http://10.0.2.2:8080/uploads/hospital-123.jpg`

### No Dispositivo Físico:
1. Descubra o IP da sua máquina: `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)
2. Use esse IP no `ApiConfig`: `http://192.168.1.100:8080`
3. Seu dispositivo precisa estar na mesma rede Wi-Fi

## 13. Troubleshooting

### Imagens não carregam:
```kotlin
// Adicione logs para debug
val fotoUrl = hospital.getFotoUrl()
Log.d("ImageLoad", "Carregando imagem: $fotoUrl")

Glide.with(context)
    .load(fotoUrl)
    .listener(object : RequestListener<Drawable> {
        override fun onLoadFailed(
            e: GlideException?,
            model: Any?,
            target: Target<Drawable>?,
            isFirstResource: Boolean
        ): Boolean {
            Log.e("ImageLoad", "Erro ao carregar: ${e?.message}")
            return false
        }
        
        override fun onResourceReady(
            resource: Drawable?,
            model: Any?,
            target: Target<Drawable>?,
            dataSource: DataSource?,
            isFirstResource: Boolean
        ): Boolean {
            Log.d("ImageLoad", "Imagem carregada com sucesso")
            return false
        }
    })
    .into(imageView)
```

### Testar URL manualmente:
Abra o navegador do emulador e acesse:
`http://10.0.2.2:8080/uploads/hospital-123.jpg`

Se a imagem aparecer, a URL está correta!

---

## Resumo das URLs

| Ambiente | Base URL | Exemplo de Imagem |
|----------|----------|-------------------|
| Emulador | `http://10.0.2.2:8080` | `http://10.0.2.2:8080/uploads/hospital-123.jpg` |
| Dispositivo Físico | `http://192.168.1.X:8080` | `http://192.168.1.X:8080/uploads/hospital-123.jpg` |
| Produção | `https://seudominio.com` | `https://seudominio.com/uploads/hospital-123.jpg` |
