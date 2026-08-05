export const tipoUsuario = "professor";
export const rotaPrincipal = tipoUsuario === "professor" ? "/professor" : "/student";
export const rotaArea = tipoUsuario === "professor" ? "/area_corretor" : "/area_aluno"
export const idUsuario = 1;
export const idCorretor = 2;