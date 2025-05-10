"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.enableCors({ origin: true });
    await app.listen(process.env.PORT || 4000);
    console.log(`Backend running on http://localhost:${process.env.PORT || 4000}`);
}
bootstrap();
//# sourceMappingURL=main.js.map