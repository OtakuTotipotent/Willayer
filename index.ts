const server = Bun.serve({
    port: 3000,

    fetch(request) {
        const url = new URL(request.url);

        if (url.pathname === "/") {
            return new Response("Home Page: System Online 🟢", { status: 200 });
        }

        if (url.pathname === "/api/status") {
            const data = {
                status: "Active",
                runtime: "Bun",
                time: new Date().toString(),
            };
            return new Response(JSON.stringify(data), {
                headers: { "Content-Type": "application/json" },
                status: 200,
            });
        }

        return new Response("404: Not found", { status: 404 });
    },
});

console.log(`Listening on http://localhost:${server.port}`);
