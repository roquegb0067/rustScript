// import do axum basicamente 
// extract json é para tratamento de JSONs
// routing define o método se é get ou post
// router é quem vai gerenciar rotas
use axum::{
    extract::Json,
    routing::{get, post},
    Router,
};
// Deserialize e Serialize é pra json => rust => json, para converter o json em rust e vice-versa. Serde é a biblioteca pra isso
// a linha do tower é pra segurança basicamente
// parte da conexão ip e rota no std::net...
use serde::{Deserialize, Serialize};
use tower_http::cors::{Any, CorsLayer};
use std::net::SocketAddr;

///////////////////////////////////////
// structs #######
//////////////////////////////////////
// 1. estruturas que serão convertidas de/para JSON
//recebimento json 
#[derive(Serialize, Deserialize)]
struct usuarioJSON {
    idade: i32,
    nome: String,
    texto: String,
}
// envio json
#[derive(Serialize)]
struct RespostaApi {
    id: u32,
    nome: String,
    idade: i32,
    texto: String,
    mensagem: String,
    status: String,
}
//############################

// 2. Função handler que recebe um JSON do JS e retorna outro JSON
async fn processar_json(Json(payload): Json<usuarioJSON>) -> Json<RespostaApi> {
    let resposta = RespostaApi {
        status: "sucesso".to_string(),
        mensagem: format!("Olá, {}! Cadastrado com sucesso.", payload.nome),
    };
    // Retorna o struct envelopado em Json() — o Axum cuida de enviar os headers corretos
    Json(resposta)
}#[tokio::main]
async fn main() {
    // 3.CORS para permitir que o navegador/JS consiga fazer requisições
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // 4. rotas da sua aplicação e adicione a camada de CORS
    let app = Router::new()
        .route("/api/usuarios", post(processar_json))
        .layer(cors);

    // 5. servidor na porta 3000
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("Servidor rodando em http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}