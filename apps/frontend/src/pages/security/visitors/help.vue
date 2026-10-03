<template>
  <main class="mx-auto space-y-8 pb-10">
    <UiTitlePage
      title="Guía de control de visitantes"
      description="Instrucciones para registrar visitantes, vehículos y controlar sus entradas y salidas."
    >
      <DuiButton to="/security/visitors" color="primary" variant="ghost" size="sm">
        <i class="mdi mdi-chevron-left"></i>
        Volver al listado
      </DuiButton>
    </UiTitlePage>

    <section class="rounded-md border border-blue-200 bg-blue-50 p-4 text-blue-950">
      <h2 class="font-semibold">Antes de comenzar</h2>
      <p class="mt-1 text-sm">
        Confirma con quién se dirige el visitante y a qué unidad va. Si trae vehículo, verifica la placa y
        selecciona el tipo correcto. Registra la entrada cuando la persona efectivamente ingrese y la salida
        cuando se retire.
      </p>
    </section>

    <DuiTabs
      v-model="activeTab"
      :tabs="guideTabs"
      variant="underline"
      color="primary"
      size="sm"
      full-width
      aria-label="Secciones de la guía"
    />

    <section v-if="activeTab === 'registro'" class="space-y-4">
      <div>
        <p class="text-sm font-semibold uppercase text-blue-800">01 · Registro</p>
        <h2 class="text-2xl font-bold">Registrar un visitante y su vehículo</h2>
      </div>
      <ol class="list-decimal space-y-3 pl-6">
        <li>
          En el listado, selecciona <strong>Nuevo ingreso</strong>. En el formulario, escribe el número o
          identificador de la unidad y pulsa la lupa. Elige la unidad correcta de los resultados; verifica
          torre y apartamento antes de continuar.
        </li>
        <li>
          Si la persona aparece entre las autorizaciones de esa unidad, selecciónala. Sus datos de nombre,
          documento y placa se copiarán al formulario. Revisa la información y completa el tipo de vehículo
          si corresponde.
        </li>
        <li>
          Si no aparece, pulsa <strong>Nuevo visitante</strong>. Escribe el nombre completo; el documento,
          la placa y el tipo de vehículo pueden dejarse vacíos si no aplican. Para registrar un vehículo,
          ingresa su placa y selecciona <strong>Carro</strong>, <strong>Moto</strong> o
          <strong>Bicicleta</strong>.
        </li>
        <li>
          Pulsa <strong>Guardar</strong>. Si elegiste una autorización existente, guardar el registro también
          marca la entrada del visitante en ese momento. Si creaste un visitante nuevo, quedará pendiente de
          entrada y tendrás que usar <strong>Registrar ingreso</strong> cuando efectivamente pase.
        </li>
      </ol>
      <aside aria-label="Importante sobre el registro de entrada" class="border-l-4 border-amber-500 bg-amber-50 p-4 text-sm text-amber-950">
        <strong>Importante:</strong> elegir una autorización existente y guardar registra el check-in de
        inmediato. No lo hagas antes de confirmar que la persona va a ingresar.
      </aside>
      <figure class="space-y-2">
        <img :src="unitSearchImage" alt="Formulario de ingreso con campo de búsqueda y resultados de unidades" class="mx-auto max-h-[32rem] w-full rounded object-contain shadow-md shadow-slate-900/20" />
        <figcaption class="text-center text-sm text-slate-600">Búsqueda y selección de torre y apartamento.</figcaption>
      </figure>
      <figure class="space-y-2">
        <img :src="authorizationSearchImage" alt="Autorizaciones disponibles para la unidad seleccionada" class="mx-auto max-h-[32rem] w-full rounded object-contain shadow-md shadow-slate-900/20" />
        <figcaption class="text-center text-sm text-slate-600">Selección de una persona autorizada o creación de un visitante nuevo.</figcaption>
      </figure>
      <figure class="space-y-2">
        <img :src="visitorFormImage" alt="Formulario con nombre, documento, placa y opciones carro, moto y bicicleta" class="mx-auto max-h-[32rem] w-full rounded object-contain shadow-md shadow-slate-900/20" />
        <figcaption class="text-center text-sm text-slate-600">Formulario de visitante y selección de tipo de vehículo.</figcaption>
      </figure>
    </section>

    <section v-if="activeTab === 'listado'" class="space-y-4 border-t border-slate-200 pt-6">
      <div>
        <p class="text-sm font-semibold uppercase text-blue-800">02 · Consulta</p>
        <h2 class="text-2xl font-bold">Qué muestra el listado</h2>
      </div>
      <p>El listado presenta hasta 20 registros por página. Sus columnas contienen:</p>
      <ul class="list-disc space-y-2 pl-6">
        <li><strong>Visitante:</strong> torre, apartamento, nombre, documento y, cuando existe, quién lo autorizó.</li>
        <li><strong>Vehículo:</strong> placa y tipo de vehículo registrado.</li>
        <li><strong>Tiempo:</strong> fecha y hora de ingreso, salida y registro del visitante.</li>
        <li><strong>Acciones:</strong> el botón disponible según el estado de entrada y salida.</li>
      </ul>
      <p>
        Para buscar, escribe un nombre o una placa y pulsa <strong>Buscar</strong>. Aunque el texto de ayuda
        del campo menciona el documento, actualmente la búsqueda del sistema filtra por nombre o placa.
        Marca <strong>Incluir salidas</strong> para ver también registros que ya tienen salida; sin marcarlo,
        esos registros se ocultan.
      </p>
      <figure class="space-y-2">
        <img :src="visitorListImage" alt="Listado de visitantes con unidad, vehículo, tiempo y acciones" class="mx-auto max-h-[32rem] w-full rounded object-contain shadow-md shadow-slate-900/20" />
        <figcaption class="text-center text-sm text-slate-600">Listado, búsqueda, filtro de salidas y acciones disponibles.</figcaption>
      </figure>
    </section>

    <section v-if="activeTab === 'acceso'" class="space-y-4 border-t border-slate-200 pt-6">
      <div>
        <p class="text-sm font-semibold uppercase text-blue-800">03 · Control de acceso</p>
        <h2 class="text-2xl font-bold">Registrar entrada (check-in) y salida (check-out)</h2>
      </div>
      <ol class="list-decimal space-y-3 pl-6">
        <li>
          <strong>Entrada pendiente:</strong> si el registro aún no tiene hora de ingreso, verás
          <strong>Registrar ingreso</strong>. Pulsa el botón cuando confirmes que el visitante está entrando.
          La hora se registra automáticamente y el listado se actualiza.
        </li>
        <li>
          <strong>Visitante dentro:</strong> después del check-in, el botón cambia a
          <strong>Registrar salida</strong>. Antes de pulsarlo, informa el valor calculado y efectúa y confirma
          el cobro según el procedimiento autorizado por la copropiedad. Después registra la salida cuando
          confirmes que la persona se retira; la hora queda guardada y el sistema deja de contar tiempo.
        </li>
        <li>
          <strong>Salida registrada:</strong> no se muestra otro botón de acción. Para consultar ese registro,
          activa <strong>Incluir salidas</strong>.
        </li>
      </ol>
      <p class="text-sm text-slate-700">
        Un registro recién creado desde <strong>Nuevo visitante</strong> no es todavía una entrada. Si la
        persona no ingresó al momento de guardarlo, espera a que llegue y usa el botón del listado.
      </p>
      <aside aria-label="Cobro obligatorio antes de registrar la salida" class="border-l-4 border-amber-500 bg-amber-50 p-4 text-sm text-amber-950">
        <strong>Antes de registrar la salida:</strong> la persona de seguridad debe efectuar y confirmar el
        cobro correspondiente. No pulses <strong>Registrar salida</strong> antes de completar el cobro.
      </aside>
      <figure class="space-y-2">
        <img :src="checkinImage" alt="Registro pendiente con el botón Registrar ingreso" class="mx-auto max-h-[32rem] w-full rounded object-contain shadow-md shadow-slate-900/20" />
        <figcaption class="text-center text-sm text-slate-600">Cuando el visitante llega, registra su ingreso desde la acción correspondiente.</figcaption>
      </figure>
    </section>

    <section v-if="activeTab === 'precios'" class="space-y-4 border-t border-slate-200 pt-6">
      <div>
        <p class="text-sm font-semibold uppercase text-blue-800">04 · Tiempo y precios</p>
        <h2 class="text-2xl font-bold">Cómo interpretar el cálculo</h2>
      </div>
      <p>
        Cuando hay hora de entrada y tipo de vehículo, la columna de acciones muestra las horas calculadas
        y un valor estimado. Mientras no se registre la salida, el cálculo usa la hora actual; después del
        check-out, usa la hora de salida guardada.
      </p>
      <ul class="list-disc space-y-2 pl-6">
        <li>Las primeras 2 horas no generan cobro según la configuración actual.</li>
        <li>Después de ese tiempo, el sistema redondea la duración hacia arriba a horas completas.</li>
        <li>La tarifa configurada es 2.000 por hora para carro, 1.000 por hora para moto y 500 por hora para bicicleta, luego de las primeras 2 horas.</li>
      </ul>
      <aside aria-label="Importante sobre el cálculo de precios" class="border-l-4 border-amber-500 bg-amber-50 p-4 text-sm text-amber-950">
        El valor es un cálculo informativo de la aplicación: no registra el pago ni reemplaza la tarifa oficial.
        Confirma el valor y efectúa el cobro antes de registrar la salida. Sigue el procedimiento autorizado
        por la administración.
      </aside>
      <figure class="space-y-2">
        <img :src="pricingImage" alt="Horas y valor calculado para el vehículo junto al botón Registrar salida" class="mx-auto max-h-[32rem] w-full rounded object-contain shadow-md shadow-slate-900/20" />
        <figcaption class="text-center text-sm text-slate-600">Consulta el tiempo y el valor calculado; completa el cobro antes de registrar la salida.</figcaption>
      </figure>
    </section>

    <section v-if="activeTab === 'consejos'" class="space-y-4 border-t border-slate-200 pt-6">
      <div>
        <p class="text-sm font-semibold uppercase text-blue-800">05 · Uso general</p>
        <h2 class="text-2xl font-bold">Recomendaciones para cada turno</h2>
      </div>
      <ul class="list-disc space-y-2 pl-6">
        <li>Comprueba unidad, nombre y autorización antes de guardar; una unidad equivocada afecta el registro.</li>
        <li>Registra la placa sin confundir caracteres y selecciona el tipo real de vehículo.</li>
        <li>Registra entrada y salida en el momento en que ocurren para que las horas y el cálculo sean correctos.</li>
        <li>Si no encuentras un registro, busca por nombre o placa y revisa si debes activar <strong>Incluir salidas</strong>.</li>
        <li>Si aparece un error, revisa los datos y vuelve a intentarlo. Si persiste, informa a la administración; no registres un duplicado sin verificar primero el listado.</li>
      </ul>
    </section>

    <div class="border-t border-slate-200 pt-5">
      <DuiButton to="/security/visitors" color="primary">
        <i class="mdi mdi-format-list-bulleted"></i>
        Ir al control de visitantes
      </DuiButton>
    </div>
  </main>
</template>
<script setup lang="ts">
import UiTitlePage from '@/components/Ui/TitlePage.vue'
import { ref } from 'vue'
import { DuiButton, DuiTabs } from '@dronico/droni-kit'
import unitSearchImage from '@/assets/img/guides/visitors/01serachUnit.png'
import authorizationSearchImage from '@/assets/img/guides/visitors/02searchAuthorization.png'
import visitorFormImage from '@/assets/img/guides/visitors/03visitorForm.png'
import visitorListImage from '@/assets/img/guides/visitors/04listOfVisitors.png'
import checkinImage from '@/assets/img/guides/visitors/05AuthorizeCheckIn.png'
import pricingImage from '@/assets/img/guides/visitors/06proicesByVehicle.png'

const activeTab = ref('registro')
const guideTabs = [
  { label: 'Registro', value: 'registro' },
  { label: 'Listado', value: 'listado' },
  { label: 'Acceso', value: 'acceso' },
  { label: 'Precios', value: 'precios' },
  { label: 'Consejos', value: 'consejos' },
]
</script>