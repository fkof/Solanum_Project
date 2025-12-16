Create table Roles
(
    idRol int identity PRIMARY KEY,
    nombreRol VARCHAR(100),
    descripcionRol VARCHAR(150),
    estatusRol bit DEFAULT 1
);

Create table Menu
(
    idMenu int identity PRIMARY KEY,
    urlMenu varchar(100) not null,
    descripcionMenu varchar(150) not null,
    iconoMenu varchar(50) not null,
    estatusMenu bit DEFAULT 1,

)

create table RelMenuRol
(
    idRel int IDENTITY PRIMARY KEY,
    idMenu int not null,
    idRol int NOT NULL,
    usuarioCreacion int not null,
)


GO
CREATE PROCEDURE spCrearRol
    @nombreRol VARCHAR(100),
    @descripcionRol VARCHAR(150),
    @estatusRol BIT = 1
AS
BEGIN
    IF EXISTS (SELECT 1
    FROM Roles
    WHERE nombreRol = @nombreRol)
    BEGIN
        RAISERROR('El nombre del rol ya existe.', 16, 1)
        RETURN
    END

    INSERT INTO Roles
        (nombreRol, descripcionRol, estatusRol)
    VALUES
        (@nombreRol, @descripcionRol, @estatusRol)
END
GO
GO
CREATE PROCEDURE spCrearRelMenuRol
    @idMenu INT,
    @idRol INT,
    @usuarioCreacion INT
AS
BEGIN
    IF NOT EXISTS (
        SELECT 1
    FROM RelMenuRol
    WHERE idMenu = @idMenu AND idRol = @idRol
    )
    BEGIN
        INSERT INTO RelMenuRol
            (idMenu, idRol, usuarioCreacion)
        VALUES
            (@idMenu, @idRol, @usuarioCreacion)
    END


END
GO
