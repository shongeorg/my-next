function ErrorPage({ statusCode }) {
  return (
    <div>
      <h1>
        {statusCode ? `Помилка ${statusCode}` : "Помилка на стороні клієнта"}
      </h1>
      <p>Щось пішло не так...</p>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
