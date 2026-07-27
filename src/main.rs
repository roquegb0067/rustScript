use axum::{
    routing::post,
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};

// Estrutura para RECEBER os dados do JavaScript
#[derive(Deserialize)]
struct UsuarioInput {
    nome: String,
    idade: i32,
    texto: String, // Sua "outra String"
}

// Estrutura para DEVOLVER os dados processados para o JavaScript
#[derive(Serialize)]
struct UsuarioResposta {
    id: u32,
    nome: String,
    idade: i32,
    texto: String,
    mensagem: String,
}

#[tokio::main]
async fn main() {
    // Configura CORS para permitir chamadas do navegador sem travar
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/api/usuarios", post(criar_usuario))
        .layer(cors);

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("Servidor rodando em http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

// Handler que recebe o JSON, processa e devolve
async fn criar_usuario(
    Json(payload): Json<UsuarioInput>,
) -> Json<UsuarioResposta> {
    // Aqui você recebeu os dados enviados pelo JS
    println!("Recebido no Rust: {} ({} anos)", payload.nome, payload.idade);

    // Monta a resposta em JSON
    let resposta = UsuarioResposta {
        id: 101, // Apenas um ID simulado
        nome: payload.nome.to_uppercase(), // Exemplo de transformação simples
        idade: payload.idade,
        texto: payload.texto,
        mensagem: format!("Usuário {} registrado com sucesso!", payload.nome),
    };

    // Retorna empacotado como Json
    Json(resposta)
}

