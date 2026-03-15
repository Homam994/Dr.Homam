const DB = (() => {
  const SUPABASE_URL = 'https://zvoxfqzbfehmkvbepokb.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2b3hmcXpiZmVobWt2YmVwb2tiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTA5NDMsImV4cCI6MjA4OTA4Njk0M30.VNgynNVki7yWXKvpoWQfgRDQ5fGEfjS1KXTs2JKfHM4';
  const TABLE     = 'site_data';
  const ROW_KEY   = 'data';
  const API       = SUPABASE_URL + "/rest/v1/" + TABLE;
  let _cache = null, _lastFetch = 0;
  const TTL  = 30000;

  const DEFAULTS = {
  "clinicInfo": {
    "name": "د. محمدهُمام السمان",
    "slogan": "أخصائي تقويم الأسنان",
    "whatsapp": "966554385134",
    "phone": "0554385134",
    "address": "بريدة، المملكة العربية السعودية",
    "email": "homam.alsmman@gmail.com",
    "contactDesc": "يسعدني الإجابة على استفساراتك وحجز موعدك في أقرب وقت.",
    "about1": "حاصل على الماجستير السريري في تقويم الأسنان مع خبرة تمتد لأكثر من 6 سنوات.",
    "about2": "أعمل حاليًا في عيادات هارموني سمايل في مدينة بريدة بالمملكة العربية السعودية",
    "footerDesc": "ابتسامتك هي انعكاس لثقتك — أنا هنا لأجعلها تتألق.",
    "logoUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAEeCAYAAACkBUNkAAAQAElEQVR4AezdB5h0UVYW6vLqFRAVJAkKkkZyEEGQJCBBGEAYcs45B8kw5JwRJOeccxpgEGSQERhyzihIUvFiRu+9662/V8/u06c6/VVddaq+fs7qndN3dq21107n/1rlLwgEgSAQBILAHRCIALkDaEkSBIJAEAgCq1UESHpBENgXAik3CCwcgQiQhb/AVD8IBIEgsC8EIkD2hXzKDQJBIAgsHIEFC5CFI5/qB4EgEAQWjkAEyMJfYKofBIJAENgXAhEg+0I+5QaBBSOQqgcBCESAQCEUBIJAEAgCt0YgAuTWkCVBEAgCQSAIQCACBAr3TSkvCASBIHAECESAHMFLTBOCQBAIAvtAIAJkH6inzCAQBPaFQMrdIgIRIFsEM1kFgSAQBE4JgQiQU3rbaWsQCAJBYIsIRIBsEcxTyCptDAJBIAg0AhEgjUTMIBAEgkAQuBUCESC3giuRg0AQCAL7QuDwyo0AObx3khoFgSAQBBaBQATIIl5TKhkEgkAQODwEIkAO752kRrtBILkGgSCwZQQiQLYMaLILAkEgCJwKAhEgp/Km084gEASCwJYRuLEA2XK5yS4IBIEgEAQWjkAEyMJfYKofBIJAENgXAhEg+0I+5QaBGyOQiEHgMBGIADnM95JaBYEgEAQOHoEIkIN/RalgEAgCQeAwETgFAXKYyKdWQSAIBIGFIxABsvAXmOoHgSAQBPaFQATIvpBPuUHgFBBIG48agQiQo369aVwQCAJBYHcIRIDsDtvkHASCQBA4agQiQA769aZyQSAIBIHDRSAC5HDfTWoWBIJAEDhoBCJADvr1pHJBIAjsC4GUez0CESDXY5QY+0XgL1TxSF9Ff6ncf3mg/7vsiP9fLLu4ZWx8rgvfmPCAArRhpMaF2f6qO2cf/cQJBYE7I6DD3TlxEgaBGyKAaYnKROxT0hefpDz/RtEzFT1n0QsUvWjRPy56ZNFrFr1u0RsXvXnRWxa9WdEbFL120asWvXzRSxe9SNFzFT1L0dMUPXkRIfP/lTl91AlN/Q/NrY5orFe3p01h7B1vtAtrEo7aHTMI3BoBP9pbJ0qCIHAtAhcjNBNjIozrSSvK0xf9vaJXKHqLokcXfXLR5xR95Rl9eZlfXPQFRZ9b9FlFn1r0KUWfVMT89DI/s0i4uF9Wdum/uswvKRLn/cp866LXKHrhor9dRGCVsVInxH6oBLOxbl1f/uxNHYd7tHOj9mtT+rbHDAK3QiAC5FZwJfINENCnMCVkSgmTfqpK93eKXrKI1vCBZX5aESb/NWV+YdHHF71XEY3ilcskWJ67zGctImhoEbSTv1Zu2oR8EfdTlJ8wcZ6h7DSYZy/zBYtoI69f5nsUfXTRZxcpl5AheD6g3G9Y9PeLCBV50VTKudKGJu77IOWN5XCjqR+cRz/CQTz+cEfsiH8TNxrTxh4E7oRAOtKdYEuiCQKY0+j1ZOV4RNHLFJlq+rAyP6MI8/64Mt+niP8/KhOjx7gJAEzvz8sP/Z8ymymWdcXv/ynL7xf9etEvFj2+6AeKvqvo24q+6YzY+X1fuR9X9DNFv1P0Z0U0n2cr8+WK1OF9yyS8aD3qSFMxHWb6rOtUUdaPdqK1Ywf/Ou82uwjukUZ/9g5jn6MO93tve8ebuts/5nIRuLea61D3VlgKOkoEMKBuGA3glcpBkzDVZDrJlNQ7lN+rFT1v0VMWETD6HiI0CIr/Vf6IuxfJ/3v5/XzRY4q+qOjDi9616G2L3qqItvKmZb5N0dsVvX0RE/EzLSYOk/vdK/wjikx3fW2ZP1n0n4vU25qJ6a33LrfwzyvzY4toJ89XJs2kjPV0F3MXBIdpvqMfrFHHYYchU7z/twIIXsSN+DXxbxKGhFWy2Ue+swHxDAIQ0PmYoSBwGwQwFiSNET1tA/PudYoPqQDrGqaS/mrZCYX/XSbmZXqoCfMiNGgXdlJhaP++4n1vEU3l3cokDAgMmgLGTrv4kfJ/QtFvFf1B0R8W/UnRn54R+x+VXV6/XWZrK9LSMkyhEUSEiik15XxixfuGol8oUi/TZzQUAtDaCuH1OhX2zEV/pUib+vfTWJT3nZ8xD3b5M5FMmfBRN27Ej7A1jade1nZodbB/xYrwT4oIdPYXK7s2PW2Z3pm6S1/O9cOO1o6zf8qb+p0FxQgCq5VOFByCwG0R+AuVQN+xrmGEb1Ebg3318n/GIgKCsECYUHmt+GGK7JhgCxT5YPz/qgIsimPmNIWPKfdXFP2bIoLgv5YpvzIe6lH2/6gcCJlfLvNfFllotz5iau0dy024fGSZX1/074oIQu001UWzesfyo7H89TI93Ua4cD8swaTzkCfiVg47Afa3yoPAIBxod7SnVyk/brvWXrbsyK40AsUuNgJF3JeoMG2yhjSWJf8KWq/9MENB4EoExs5zZcQEBoFCAPMqYz3wsMht19RHlQfG9NRlNoMXj7BA7PoZE4MiONgJlP9Sab676P2LaAOfUOZ3FP1qkTDMvqw7ZWjqpN4ElPUVAusbq1DajoV3U2RM03E0HluDaVim1KztYM7WSirJ+tG2teWW/9Sjk7RdXkj9hNmMYG2GVmGdhjCw+G+jgalBmgV8/2dFNv1nzci6j2k6Wp441pwIFgLnH1Y8QrDLK+f6UebaUv+mYeWVJwg8QMAP+4Et/4PAzRAwajWqpSEYlRMcUupLpqGYGFATBoSaCYqDqVnXMOJ/p0pM0/jNMjG9FhrSjPYK3tmjLPVD7Mo1tfYfqkRTWgRK79ayFZjGpb7/tMJtDDDNRYhaJ+n2V9CNn8aqBa46IBnwo228eDkeVeQszAuVaWdaGSvalLjiqTNBwY8gURdhSJvQf6tE2klTNN31UuV+uqKxDuK3u4LyBIF5BHSw+ZC7+ibdMSNg6sSo18jbLiZMCzNibupLwpshYXB2RFmcfs8CyhmP3ysTYytj/Yi7tuzxnzqMdVIVdbeu8sPlUH8bA0xlWWzHbN+l/K2tEK4Y8iY8KtrsI758lI1sNLCuQVtwUBLuz1EpxSEkaGgEBa1DWn6wFs6PhqcN8uJXSVfCufkT4vxNgxEi1kbEES4/YdyhILARAR1lY2ACgsCAAIZkxGr6xvx/Mxh9qO1D9LUVoxKGTBF9c/litNYRrD9gaMLKezEPBkuYmO6yTdiivK2/1oDsGLP+8FrVGutDBGtZZx+4jQHyhQcNz+l5goiGY5qJ4IafqSnpEA2D2zSV9RxrNYQx+3+qjIWppzo4N1NeK+8DKUs4IcLf7jjv1IYHYdLwR0t7P+ocuicEdMR7KirFLBwBo993rjbY0orR6TtN5X3pEYenOBbBP78cpoF+tEzMkD9mhcprcY96I0yaZvIT1QIalTUhC/Om9jB+zHhkwm2XFgYdzp/m4uyM3V4OXXJ3HPFpHX9c5fxGkU0HDmGa/rN7zNoR+pYKs0X5q8r8sSLnXwgVAwDTh8qTp/KQ9RFumoj1Hbu6aDPKa6ps8gSBywjoOJd94xMEnogAJmPx1ZSNU91GvpjRVX3HKFc6DOhXKiuL46Z9/m3Z+xFHHuK139JM7UNdb3ZMXpt/qjwJl27j2M62M4VbHLcziuZiOsmaB5ylx8ytxcjToUibDtDPVv4ElzBCBREUtjQjGgmhRtCoi+3O1piU10KkslhviKCNqIsFeSf5hQvjh9hDQeASAjrTJc94BIEzBDAPc/EYm10/pjhaeGCWZ9EuGO2PAZqmcp7D+RCMThjqBITI6G7/pZvahQiA1sS0E57dNnYagUsjLYzbgmth3CI3QYCpw+ynK4Gpsh8qk/13yzRtZf0DxvItr/UjT79pJg/lm2pzYPIHy4MmqEz+4hkYOENCYKC/WXHs6DKNJl/5iFfeeYLAZQTSOQZMYr2AAObBwzUj1i2MTPkh/m2yN2E6zTCNeK11fF0FmrIqY6fbceV/KASb/m3BRL34tYlZm+KyHdc9XQ74CaNtEDwECO3he8rTdS20CVNNNAjMX7zOt6KcP/yaeMpLXMKG8PjX5elQpXdkIEAAqZe6Eljsf7fi9G6ysq7fGX/2UBC4gICOc8EjjiBwhgBGZHRqB5B1jzPv9ZTHHEMRH8MShuG5LNE8PKbXae0OQu0eTenQ6LdUOyzUXXv8xrjZCQ6YWm+g0TkdDjOL3gQEQWt9g7Zh6smUnzAYEhwYv3yRdEje3PJnorYLQwQFzcZ6iHURZUnLT77iSMPPtS4GC+rKr8PkGwoCFxDQuS94xBEEzhDQNxw6c7LZaPUqRiIMYUB29tA6HLzDqM6yW49kTZ/Ymtq7goRhVPJnPyaCh/YwkTZizLY/22HlJDjNQBgmTnC4wsU1LQQHjUAYkg/C0JkjdfhosiPxmE3eD03ElJZ3Q5gTSrQUcZF6qluX1WmF7ZCS9RIRwCSWWO/UefcIYPY+5uTkMyZzXYn6EqZjB5KzEa4n4e50GJF87PRxGy7B0WFtitP2pZvagjBtWJoastZhI4LdWZi2cDiZrsLUaW4YO40BVkzpxRvxaDd8Ubs7Dr+pnR8S99cq0B1h3GU9v2ZGmepK0Fn76rKlES8UBC4g4Ed/wSOOIHCGgHlw13TQFjCaTX0Fc2lyzbrvbFjolQ1/ZhMGZdTt3IGpkqvy7TRLMLUDjXXlxoytIVnrcE+YdQ8Cw5SU6SqbDGgdFsdpBvxpI4QLrDBw+ci3seRG/DZRxxXedqb8kLKdpLcYT+MQT11Nrynf9SbqPSfkxQ0FgTUCm5jCOjD/FoPAtiuqX9iNY1snO8KANpWDoZm6cuWH+XsMcC4upmh6xqlnmo1RLr+5uEvxg426wgfDhQXTjrXnrwCCw1oHraOc68N8ttxaHEcO/xEccEAYvHjy6by5kTIQO2JH7NeReEgZNBs7vJTNTYgQbjQPZSrb++d/Xb4JP2EEdJYTbn6avgEB2zhNtTjIhqFhPJjKNHr7Y0g/XoEOsFn05V/OS4+8/mP5ik+AOHEtLibGrKDFPY0LUxv8pqwhuBur1zr4a7PRvZG/8xytdTg3QiuDjXjyAYJ8mE3tL05Th93GlFZZ3oNLK1vYqx9tkyaiLHdlRYDcBtkTjDvtpCcIQZo8g4DR86uWPw2hjI1PMyOjWSegTclsjFwBGJfpE3PwRuTueTLS1Q8xrYqyuEebVJrWYerHRYeEh8/paiPtQttMF7np1xqR9vOXThgiRNs9hweshW+D5EVw0IRsGZYnIWbh3uCBWxwCRd24Q5sQOGF/HfWEm5+mzyCAYZjKoB108Fw/wWDExUCddB6nroR12tHkb+uoNRKaCg3HKN3OLGXIb4x/aHZ1RF3PNu1mcvdV77DSHiN64dpMYNiW6/S4dhMWCHbdRnHlLT4/Jmo7c5ukbOsxhIhyCBBCjSCkeTAJEHXaZrnJ64gQSOc4ope5paZgHr3IrX9gbJuyFmbtw5SMXT3iY0ab4vPHOF3BYdEYkzJVYrrM9R3XpZV+X6StpneQeqsHP98CcQ2JHVbOd9A6Hr/tMAAAEABJREFUaFkYNGHpgkXC1QE+O6yM/IVpK2q7vLjlCyPEjfhti5SD5EdoECKEnXqpr/L0AcKDBtpxxQ8FgQsI+MFf8Ijj5BFwmZ6ttkzMo5nlJmDM6TvhjPlsitP+8kPiOtT2p6vV+orxR1QEo3drB8rVL8VDFXQQD8aK0TZjJyhcMGm6yv1VtDbh1jnUn6ZBcLhCxGI1Bi2cwNAgcbRPvkzEjoQ38W/7Nkz5o86XMFdX7TIYUE/hhIc2bqPM5HGkCOjER9q0NOuOCBhhY+RGoRgJ2pQVZmNaxhQNxog2xR39MStf97OIy18Zzkn45sXzlIfRr76JyaHy2vujHtoHF/i4tt1X/XyZUV0thhN+hARM3F9F6yAsVV5a7ZQP4seUll0YE22yC9sWKQNZAyFE2NVdPdXLwKHXQ7ZVZvI5MgS68x5Zs9Kch0AA8zadhIlgKpuyEm7+3AeWmJvijf7yQwSI6Rxf+6OJsBu5W3dxZsKUkHMoyhjT79NOcDgboW625vpCoM0GRu2YrrqZxqN1uLLeOo8pIu1Fwsf28JOO2SROk7io3bsyrXsgZREgeIK2chtMMHdVdvLdMwIPW7zO8rB5JP3xIIBZuFoc88bUtIwfs4l/k5PTtqPavdPhNzUxT1tJf6kSWDMoY4WREWA+okQbsRhtVK8OSJym0T3aO/xhTXkizNSttTQNN+baOWa6ihAk9MShifnSomvWmXZcYcZIPG1tzEaz6zj6sfNnIvZdkbqrGy1JPZWjzk3cNBFmKAhcQiAC5BIkJ+9hK6r5b30DzQGCsWGeFogthnOjubiY1Jy/+Ebvtv4iTBgzI4yYrjn3RT5rI7b6dp06L3Vrar+HMdUTyYNp+qY1Dh94cirfTithGKz6M61v/EAlcoeVG4jVHzbCxKmg82d0szedR7hnC5zVoQWItqm/d6ENwvihe65ailsCAn6AS6hn6ng/CGAUBIipGSViIMwp6TcWXh0edAZkGj66N+XB36iX9vFzlcBWYIyLxiHMKJ4mZMrokRVu5G/RmoaEuZfXSjzEfhvSTjSmkY+y5e8SSZ/vtbNKuXaKGYmbkpJG2j9brVba7yoSWkfvZpLPSOKj0Y+d3yGQuhAaBB6Bom1I3bxnZigIzCKQDjILy8l6YhwEiNH+HAiYTftjmG6QxXika//bmpgWTcROLgzZYjTBgplj2sr0oSM7nR5VmVt/cMWKu7TEUbY4FXT+8EPnHhOL+Ii334A7oAgJ01SE1RtXwCsX+cCTOpR1RWjBRbvV07Ut1josQButw0GeSHzlI/ZDJvWlgRCO6quNMFFnJmIPBYFLCKRzXILk5D1s3cSYMZYpGBgMfwzedI0dPNM4t3XLDwMmOJzUdqYEQ7MWwp9Wwm2hHTOnHdgB5UNMvpRIU8D4bQW2+O9choN9FoAxfW1hYow0K+sZpqbs+nJuw0FGU2WvVxW3xmELs3YSFMou7/VV9DQumhKNw9Zci+TWbAgOQlC8kbQLjX6HaFdHwkNbtQNesOu6Cm97zCBwAYE9CpAL9YjjMBDAODEQC8fsm2qF2dA+CJFNcW7rj1ERIqaDLEa74hxD67owxaGtEGCmmhx4pJnQFiy6I3ZnM+zmImhMQVlHsYYhTBxahqtaxLObilAisLQLM1V3QofAomH4CNN3lifhYeuxaTd1UB9UQYt9vOexLdrPD2/QtqbFNjAV3x0COsnuck/OS0SAAME41R0jYTZhJvoMRutWXVoBd4c/jClvAoO24YzI91dmPulqkVqdlGOunkmYGPljdtLQmggUmgWhYhcXwfIylQchgrhpHMIthtNUjLQxT1RRV8qhvWg3DUP531oBriFxYFJ7aUXKLO/FP9rZuLMj7YMHO/NY2rr4l3WIDfBjPMR6pU77Q4Dw2NQvMBtEgJi+wmDUlB9zG6RsTAuzdiDPJY2PqYwJLGGEBUavnuIxCRZEoBBANBl2xG1BnubCX76mnsRXf8JIvtpkW7IptK+p8r6yyJQaAUbj2GYbK+v9PmelaxPiZBIabR/N9ucXCgLnCPjhnDtiCQI3RAAztvsKA79hknU0jAitHRv+YWSCxKNlOCtih9Z3lSdtwMFF237567+ECSFAmyBcrHWwC0MdxkQEDkFi+7F8CIxvr7wJDAvjDgL6MBbBo/yuj7a2vaLPPuqMZgMP2FO7CNOuOzfstPmAq52q7RsBnWTfdUj5y0PAgjIGjsFgNjdpgb6GQTVtSiM/zEze4rDTGKxFuDIFg7ceQZh8W0UgWAgV2oL1E3Gcbjfl5JAi4WOH12MrrikpaZnIWovr1Wk6NBxtIjhoI11+JVtvFx7d/ObourbNpTkEP22Dc2PP9L74H0L9UocDRUAnOdCq3apafri3SvBQkY87MaaBgcy1Es4Ik7VL6aq40/TyHGkafhO38mgFpqGsUWD8hAMB4jAf4UCL+PrK7BuKTH8RMNZTHPQjZJyctxBOAzE1JU/1qugP/chHfg+d0T1n0PVm4gnMsR3eObrnaqW4Q0dAZzn0Ol5XP20wLcG0AGr64ro0CZ9HAOOwboBJz8d44GsKyLrCA9fN/su76WYpbh7L6NmaBk2FUDDFpo7c/LUHQ1T+NNdN/tN4N3HP5X+TdPuOo95IPZh+TxbTEXeT8NDdETg6IYzp3h2Ow0iJAWAQaqM95rntxnnu8rA1s4w8t0AAnmguSf8AMGhayFyc+C0XAe+dsPA78psylceN+t3vu3WHXP4UI+tzdvvhSdOwQ27Hjeumo9w48oFH1PkxNSNOI09M7mmrzrZ0vkCZT11kkXV8mV4qqqA8ZwgYwcPwzDlrYCwYzGxgPBeJgN8B8l79fpjes9/VIhu040rDqovAR50bQm5ysFXctTt4zVFrcRreIByLqcNbDLUl08KrBVUv8R9UAx0ucx7g+cvuLIApr7KuTxoz0dgxuE+JjDRN/ZjG0m5u5pQwlqlf3MtGQL83deX30+/XgIxbyzb1BWGnRHBqcqvBs1XjXfzpjBHi94flh/yODMhMsZbX8T3HKEDGt+QH4LS0U9MWWy2iGiV40U4ou2XVNRbPV4ls/yxjveOGiXQU5tHQDRpCgMDtqqhGp81QThGjq7BZYph3iBcgdkRwXNcPltjWm9YZBtO4NArX5ZjVcO2NWwxoG2Y68BibOmzOcEbKRg8YTvM4KrcOc1QNmmmMjmBEZUqLMHEdxZdUPDt3jBBcFe4epI8sv3cretEiowiL8dIiODEr6IK2wn1MRCjo+EZN2tVtZm/yo4Ans/1iLhsB77m1D+8Vo/SOTWXpE8tu3dW11/aOMbXDwSyFq27eoCJ9UNFbF71gkXvVbP22FRwvoXHgMXCr4NN4MMZjb6kfhDYykU7iR+HrcbZ7fk4FOnnshlWL7m9U7o8qenTRmxW9WJFFeTe26lDSyqO8189oX3ss/B8NBOPQDG1ljgRDgpfJfy4O/9ByEMAHkBozCRP9gPtYye8Wdf/Vbr9/nyt2OaeZiXetxn900TsXWQz3BU0DUPzi68rP93Bo4/Ip53XP8YUD7fhadXWLusOI5cVbH3EiWYf4rPL8F0XOEDjn4KbX9y33xxd9YBHhYg2FQKGhlNeFKS/uJRNsjKJaA+Gea49F9hYgMJyLE79lIOD9jUR4eO+2aR/D3H23bfo2tFFb/Zb9pmkY716RPrjofYqsl8Lgm8v++UVuKmB3ySctvbzOH3mdO07JcooCZHy/XjxGiPgbebvGwunkTymPdyr6iCIHzyy8f1jZv7zoc4s+pOh1i1wLTs0t66WnOy/zUuCBehAOhIjqjf0DVvxQ25mIX2iZCHTfZGKozO4DRtdLapW6q2+b7PonYkcGftYtDAb9hg0a/Z4JjReqCLQKv/l3KfsXFVk7/ZUyCRMCtXnFmGcFn+YzMojTROBBq3UGZP5SB9EBuf2QXI9BcLxJRX3Loo8rcg+U68A/tuw6mREK/zcsN/XXugqV1z7w8lqUloJp+LF0veHBjmACG+1i3mf/UX5ouwh4h3I0NUt4sPOjgbquBsP0zvkvgbqu2mBTjI+OPUtVnGDw+/V7JSw+o/zer8hGGrs0P6bswtFnlt2AUb+XHwzYy3v98ENrx6n/CwOY7wHdQdoUyw/Ktd5fWI5/VvQ2RR9a9IQiX8wzZ2oh/gvKLY4wX7ZzpfjzlJ+dGjSVQ8fcD8ZOEmZV+3zTgB8lNyJADr0d6nlXGtt6XR63iXtdXvsK1y8JEf0deff6+8g491W3sdxNWOuLBMYzVGRfq/TdF79PgsFvkdAwFf0SFW4XpnvQaBxvW26/068t8xeLrO2VkeemCAD+pnFPNZ4fVLfdD8oI/Y/Lg2ZiMe39y04zea8yv7jI+ROjHn5GOt9UfjqodZS3K7uPGFGhjY78cOd+FKPfaK/kO39oYS4i9GNSNupC267ftL3NjnMM5vjOr2vPbeJel9c+wr0/zJcGoi1MfXw6z7+Puk3LVD9+pqEseFu/sKX2tcvT+oXfm40xX11uwsPnj/3G3INmhuDty/8dij6t6PuKXLypndpbzvWjDLR25N8ZAhsMjGBDULyvQEAHI0yQaS4jdrszCAnrJoSHRXcL83Z7ERYW6T6x8vyyoq8ooirr5HZ4+OCRk6tPX/52e/mB+CH7cSuL2VRRdvoYfbqocJzGGgvUZ9SNn7oh9iUQDDEUU4zO/iBrW8htBciali2aY3toXAYFwqVp4kaPqMgYWhmLe2Civ6m4d0sTcf7DQGKX71a5ypwjYUi93B7hY2HPXBEdBn79Mg3aPrlMU8d+T6aRrWfY9KLufoumq2gYZgHEJ1RslrG7jMDQNlTZrJ/RvvbIv+sR0GGuj5UYmxDQ6QgRxI75Eiamukxl2Qr8jpWYdvLZZbox1tQAJvUa5SY8THv987LbTvypZVK137RMmgrm9Ixlx5z8sL0vP6zy2tmjLb9fuZsHL+N8CotdG5VvGuA+6qLMbZL6E9LvUZliPqY3vCf2Jnv97fuvKOePAYB32HGkQdyfV7EwL3evwaaci3ngobIYtffJTfO0A1FfFrarNilL/siARB0IC+8HlqabWrOwocU0FMzZTSEbpL20xEXOYQi3g4qW4V0RMG5itsZBYFS09aNctHbUv9Fezjy3QUCnuU38xL0age6MmDDNxHSW0+/U6g+vpDo3ssvDVmGLdUbEBIpTra9ZcXR+mgrGZOsgJuWH4QCThXsLguZ6pSNUbvoDv2k8baDW25HGjqpaFx4/dn1nLuxCxAN0mK55rqrXixTB0q0ERrbs/IQR2BV8LjxpIK6sENdBU/GkabLGRahuwENWB0v6hfYh9bet3VVABAi38JtWvuMy0Vw6/votvJ6iIpjOpYEbNFmXoMU76EtLNyVFk7c5RRw425xCQ6bd0zJMC9P6bXT50srvx4p+r8jvz+9QG9os7zzbRAAT2GZ+yWt1aceVDmwEZErIydUfLJDMwTqk9FZlf88iQsIhJSM/nd00lkV3U6TmU0UAABAASURBVCOvWOHiGFFR1f1IaDPcfnCmxozWCCGjNz8wIzk/Uu/XDxZVNuuHHa0dG/4ZhbqaQV2mUbRH3kjYdXmJc0hkakZ91NvIF0ao/UZTW0d328WXvqn9mUsjbSAwCRDvHZnm4Y/m+kC3UXjbmdyIHUaEtf7oIlMH9AhegyQ3PliTMI2rT5uG+vRK9AFFdkJZCLcxxcWE3oE77QgG8Q3AaB/WPPwGfGCMluH35d2qrzSVVZ5dI+Al77qM5H8ZAaM8o3yHkvyAaBiEib3nRlUW3n1Jz506RlJ+lEb9flDUe9Nb4ptuMe3l8CMV3jSYHybh5IyKUZsfrdGz61mM+vqdy1PN2mRH3OrnXh9l8/ODbOLGbDDf0Y//Ekj7mmDBrt4EovYQ9pgQvyZxjMi5xeFG7Z7G53/opP7Ie9S3tAEe2mkdgdltFUfcbhN7E9wMWAx4rBPZxm5qyRQtzYC2rY+afkK0ClO71icIE+tJBIy+KU9lG7w8vgqzSYXmbkcVTcN0Lz+/G1qS/qmOFXX9jPa1R/7tFgEdZrclPHzux56DURNh8nPV0G8tMhKjcfjBmOs16rIoaDoMc6soKz9aph8cwUCovGR5mOJ68zItGn5SmYSKqTBrLAQLf/laiHT61sK9H28LBPlVspVRqB+wHzPGgvgjccT3g+deWh9SX21Q9ynD4T9lluJhpqP/NJ04c378D5W0FdES9CHv1JQSpjxqIOqvbeISNDQKmrH+81oVaGpVP7UhxKE82rQ+R8s2MML8DWYIFdNVpl/lU0nX/dj7sN5mwEQ46KfvXYGED1OevijpMB+h4TegLqii5dknAl7ePss/5bL9KKfkx+HHZBGbBmD774cWSH6Eb1EmwWLh124STN6PiDDxHtkxeu4eEZo2cPGbffFGfDQW6yumwMwxO1XvB2oqwMEqWo2tj9YDui7yRvJHVY0VTQiz4a8N/EcSh5t5aKS+SP2Q+nEzkTa1Pzfih9inYe1uU5xDJPVD2kEYdpsJEAKS1mnAYBrV4IA2Yb1HfzDoIAxak9Bv9B+CQt/RrwgSmrG+Q+M1nWo3m7KQftnlMJXz2AKKwNA3ba/Vv62BfEf5/1KRA7v6ufhdX2ZTRcmzTwR0pn2Wn7IfIOAH8cD2xP9+7Pz9gMwB22liuqvniWkaVHqL8T9ZyayvWPgmRDqt9DQceRhZ8rf4TgAQLqa37HTxA6admD6jARlFWpQ0LeHHK10VsV7f4TYKNZq07oLRiIdZGFmKizANxD4leTV1WLt3bcJEGW2yqwMTaR8M2Zv8Tvh1mjG+OPwR+65ImUj+zKbR3Xb1RdxM75zAx9R9B4fGitFbO3v5iuSwq3UHmwQIAlOhDzZwrFa0V9qF3YH6iWkn/cYZDP2I5lJZrLVWgw7UWOl7hJJzU9b4aBKmsAgLa3embAmgnrJtDUN+oQUgoHMtoJonWcWRIbUdc7MN2CHG7yxU/BgtSPrR25rqx0hrsfPLCA8DN/IzosRw/LjlgdiRvIVhMqaz7Le3fdgtxARCFXP+iCe+cxSmF5SvTPPUGIxpB5qS76xY/JeHOW4jUkLGaHfa5+SHzguZWJSJeDORPJhNwq4i8TqcXfp2t4nptX0a3mHSqivquEz+iH0kflOSd/t13HYz229qKhPxZyJ2DJzwtuhsBxnm7ooOmgMmTXvVN2gQRve0CJqDQ6+IBmBK8xUqMxoEk8ZK+zBIsI3cpg59SJn6ThMBARvu7mv6jMGKKSmaBGGkbxA++ofy7Ep8XJXnjJTpMnlc1faKmucQEdCZD7FeqdM8An5ofsR+bH60prtoJ0Z3315JaCR+qKaijPKcT/iq8ndNQxkrP24CxXsnPOTH349fvnMkTJyRMC3rJ24sfVQFKMs0hnUXC/oWSzEnGpN1GNNk5sTt4TeFpp52kKmneXSL/bbEytMHe2g4hI26Kr9JvVEVud5iC4epnXuOOq4weYxufqO7cRFPmPKZ/GE0xuUvHn/2kfih0Y9deiSdvJmIXZu9J0zbeoH1BtoCLcEaly2tNknQRAluAhy+piVhbYrTNlj4ew/W0GgQBL6tsjQIW8ZtiaWNEDy0E9qEstVLHQkHfUT91avrJ4xdXP2AyU0YOKynTupnp5SpL9twaTMWvm2/NbCRt3zkzUSjnTu0AAS8+AVUc6lV3Fm9r/qxma5yvsTV05i1cyW+a+JErpGgbcB+zKa8/JgxiWaMKtx56xsYBz/hTMyFnzDxpOXf4fyNVDGjp6sAAsFVE0a2RrmEG43JegtGo36mSDA6wsbcOiZkj78FVYwHIzSlRtvBCK0JET5Gs7QdHwNzDxmNx0lk5ZmKsRvICXOM0si8iSakvuqPqpoXHgyRJmZqjjbGdJCQQNN+1AmkJ8gxUnGVYdRu3Un5hKJpIhrBq1QimhkmbisqHDBX354heI3UMf7GAA6Ev7UGGAgnDGgQvlFhJ5NpRzjIk2DQfhofrcHCuLUw7ami19OP6ovUmaktTG7E7R3yY3KzS2+NhGahz/xWedhW652pg/Jtv/VeaDnaYA1DXFjLp5JceDrfC55xLAsBnWRZNU5tb4MABm8rsOkE88xGqZiW9RPM1yjWiNUuL9NivtiISYw/eIwFE+gfvDCEMREm6sPNRB2PXTrpEbd4+px0mC4mZ17elBjGZ9oEEzSNYgoGw3XtNgZlKsacuYVWTIsgwUiNwK3baBtB1EwY8yWAECbMROJh7OqiTk3c6m7ET5vCsE31iI8pEkbqLs6Yhp+1INoexqlcprMNCPOXD+ZPUFhnsr5kSgnDNVqnwXkntAsCkVb2yCqE4DENSCARToQUjcGUFUHtHXS91QvBHLHPUWW71t7U23vgbpJXkzCagg0dhIX1C+3RTlOmtEdtoHF+Y2VgUCKuAYxyy+v8mbrPA2JZNgI60bJbkNpfh8D447XITkjYEuk7BxiCA1mYFi3FqBiDw2gd0PKZTswfU8FMxryUy5/AMTptpsWvwzAhTE4/a//Og1+T+O3PLi/ELp18CBwjasyT4KEVED4WczFW6yyYP2b+nJUQEUo0AQvEpoGYBIE85Isq6vppu+kzTNv0nAVm2pMtqDQXETseO1Jv60cYvPUH+SuXyY8Wpl40GVNGpqVoZ+53Ug+ajfTaKG+YMBEM4M9UjvKQMMSOxjD5IPmgjsdst/jy5CduE39TUYQF7YKW4yoeQtxWXP2DNuhyQn1I/9CnpnXg3julArtHQIfafSkp4RAQwBzUA9NA7PwwKEwAQ6ClmFIxIjZ/jdxaOsbvdIQGoYL5dDhTfsJoP8K5Ow1THP2Oyd00uoU38VfPjjea/KeEMY40Dece8xjtyuxwprKFa4M8ucXh18QtLjdTPMTe1O6Ow59dWtR2+bMjcbiFI3YkbErtLw3cuzwm4i8NO4Fv4dqOJ4MJ6xK2hbs3ynkOmh4Nw9SYNSv+TnrTLMa8xzLlK//QiSGgY55Yk0++uZgJAkSb7AhTQASKK90fU540EYyDJiE+ZsGN+Rip2l6MAVlT6S8ZEir6FlN+lc36kR7Jg8mzTXbU7jHdaBenif9IylTPpi5/jMMuXucxNYWjjsMuv3bPxe8wcZWJ2JuEI2nbj8m9iYQj4TBpgl37sfPnblKOdIgAd5aCVmGrt8GA6TybGKzDEBgOr/oCp00Y1se8b1NR0spbPp1nl8EUxgydMAI6xgk3P02fIIApoNVqtTLqZrfDy04vUTEs/voNxmRO3zkSaxW0FddWWIewxdhJdldSGOk2E5KuiZ/85dmkDMRfOUzuUyAYdDvZx7azw6tJPHaCCp7sGH6ft3AbtPNBFtyts9hAYV3Ftl7TUDYkeEcWul08iAwIaI7KapJv25UZCgIXEND5LnjEEQQGBDAymgjGhJnoL0xRbDM1f2+njQ/zGN1a0DZnbr6cYLFQj2FZuMe0LDC70v7nKwMMS1oHzUyrEBiogtaLvF1OMzCm+ghv4tf2XZq3KUdcNFcf/kgYU3uY3N1e9sZZOMGAsZt2cuUNgUwwW4f4tops04BFfoKCVmHDgV1p3oFNEta5CHMaYuNNg/Tuel1HGa7KoXmqj7qgyn79qAf/tSP/gkAjoKO2PWYQmCKAaWD0hAg7psIUz8KvBWf2kYRjeL6LYqHedlyHx0yXONBmbt12XvPs1lowPpqMqZXvrozs5jEyNu8uD5qOqTFz8BhZRTl/1OfcMWNRF95tsl9F4iFx2mRH3Ih9JHWa+k/d4k/91B1h3oSDA6Kw1m4CGQYYvx1OdnCZdoJfr1EQ1IiAthvKdmjTUXbTETTKlD9iH0ldbEiwo8v0HMFBuPDveNKN7vaPuXsEFlNCBMhiXtXeKuqwonUOTJyGgLGojBGsQ38OvbUf/5GaATExSluKnVHBGL+nIppmMeVl55eDbpij6TAjaFMuRtN2idn2SoNxNsKWY/P5ptYwWaNxo2c7glzp3dqMMrtebVaR549wdO5RFiNzbSzrWgtiIukRO4HBbOKPRjc7IQo7goEgtFhNMNC+frwimGay7tDtp6URrrby2sL8ahXH7jgCwpkZW5VpE4SE96H91iq8F/WetqWSn5/9YB9Jfb0379A0mDzUlX/Hm8uvw2IGgTUCESBrGPJvAwKYCIaKYdEE9JdmMrbVEiCmssTbkMWaiXVYx2MizFj+tAsjYEIAo/31SvDTRS7bIzQwT6NsAsY14bbVug0Wk7XFlDaD+dJyrMPYPeT8hjMYNBtTZ0byrtZwpgFTr+wv1c1onKCjcRFSBN2PVkRakamjsl56tIFgJBCVo0xrD3azEQoEoPoRBgSjbcHOubguxDSTcBqa7bEOf9LaCFmH9axNyJuGQiApC25NlypzAw/vz3ukQWovIogIEPnL4mHylz50IgjoSCfS1DTzjghgJpi6OXRZYEBMDMiJZwKE+7Yk307Djto9mvwxNqNsTJSG0VMuGL17v6y/YL7OLnxCJXYQ0HSPKTJCx6E3V2s4rEfIOFgp325LJTl/aAmmi5yLkQ7zJ7xcByPN9DfDDR+n6pVhHcLaA63KFSPO1NCaaB22StNGaErWfrRHu+SLuhLsTaNf2x/GlC+tw/qHcyjqQHAT4vBA2oTYH6aspD1yBHSSI29imrcFBIyAjdwxmc7OyBUTMg3SfvsyMUVlt6DBlBFtgsDBJLWBFmFDgDDxR6IJycd0jm3JBAZiJ1RoLZ2/eNK2yd7lKBMpo/MUD4k3R8LQXNgu/AgQwsO7o+FYM1FfZREa+AJi5xcKArMI6CSzAfEMAgMCGKcpHUyYdzM7p8GdqsZokLB9kToh5TObRnfbN/V7bbA2QDiK20QQSNMknjCmcggM7jkSjubC9uVHgPRVKKYOCRB1RN619mob2lcdU+4CEPCDuFjNuILAZQQwFAvVdgkJxWiYpq9MY2G63EsgTBGTnNa1hYa2ojFcmnZPfzPC+KGOc+jmk1cFaSA0Smd8aE/ldeHxjtEFzziCwIjAkjr9WO/B+IbmAAAQAElEQVTY7x8B8/w+u4upYJpMd1K5e8qW0Puv0d1LVP9p6lGozIV3fPG0nbtNdv5XpRPnEEgdaY1uHDalZ2Bgim9sCzshqk2HUOfU4UARiAA50BdzYNXCUDAb6wEYiykQVTSKdUmguXTuJRAGqp5tso/kN4FGvzGusNENG3jwYx/T3da+6/jqqAxTj74BYl3HGkivfwhrOvS2dD1j7hEBP4Y9Fp+iF4SAUapzF5iOkSnCkNyIa0pkKQyHAFRX9Wf2K9AWdn7C2Ke0KWyOAU/THoJb/W2/pjlqoylJ23cPoW6pwwIRiABZ4EvbU5UxH+cznJRuZqsqpkKcaF5KX+p6YqCECebPztQeNLav3eLAAInbJHxJ5GNfBIh1D1uKtUObltSG1PVAEOgf04FU5+GqkdQ7RQADtQWWEMFgu++YDvGNC9M4O63AljJXTzuQLPwji+fawq5dtCmj9Glx/MWVnomkkdYUnjynaQ7NrX2mrggRO6/swIrwOLS3tKD66PwLqm6qumcEMB1XcDiVjvEQKu7DWtJOLFNwDh06+e1LgehzC1cn131dz9cEbRgor/PH2ZBvKZd4nY7dVwuRw4LTNBX94B6/d4LQIdA+fe49HlxFU6FlIKBDLaOmqeUhIGDbp/Mgdu4QHqY/jLxpIEbjh1DH6+pg0dgNtk6rO2GOfKb10ZUQESim6cp5/thAII14nY4ddRpXj5wnOFAL4UHYW89yTYpprC1VNdmcIgIRIKf41h+uzZirG18JkJ7O+TuVpamRMg7+se5BkyJITMmNJkEhjGAcGyKNQ5RjXGlpYvxoNdM0Y/pDsJu+smvuWasy2qj+2hUNpADJczcEIkDuhtuppsJszJu71oSJAcHimesfLQSTKutBP9qgglOT31UkPhJnavI7dPJuaCAEvXvNCJFux6HXPfU7UAQiQA7jxSypFq7tcJW4HTzdf+zCcjPv0hnSXep/lzT7eN8W/b0nFzmagjSNtZS67wOvlHkDBJoB3CBqogSB9fXnmI4FY4cK2cHiShMaiP5kpMsvdFgI2CnmBDrh4fZdU5CHVcPUZnEI+MEvrtKp8N4RMH9uMd2V5PqQhXRXmhAkLVT2XslU4BwBQt07Ymb66hyWM0uMOyPgx3/nxEl4sgiYxvIdDt/jwJSMbp+90DC/XkaeA0TAArpT53ZfRfs4wBe0xCpFgCzxre2/znYc2bbq86xqYzeWhfSnKgeBUkaeA0OAAKE52jkWLfHAXs5SqxMBstQ3t/96Y0Y/slqtbGHVj2gfz1TVIkwiRAqIA3r6/dhyTHs8oKqlKktGQMdacv1T9/0h4BCa691NYxnR2iL6vFUdV7tzlzXPgSBgipHWSNjn3RzISzmGakSAHMNb3F8b3ItlLcQJdRrI81RVCJIy8hwIAn7jDnrafeUw5IFUK9XYBgL7zkPn2ncdUv7yEDCKRebTf7iq71pwU1eudndRX/pVgXIgj/fiDIgpxyyeH8hLOZZq5Id+LG9yP+0gRH6jiv7tInZnQdy1ZA0ElXeePSNAIyQ8svax5xdxjMVHgBzjW72/NhEa7sb6qSrSNNbTlmk77zIuVqzKHvnTQtwdX33tzJE3Oc27TwQiQO4T7eMsy9UYLld05bnpK/PtfWitGdhxtvzwWwV/6x6uLTn82qaGi0MgAmRxr+ygKoxBmRp5QtWKFkLzsA5i1w/tBFVQnj0hAH+aB3NPVUixx4zAQwiQY4YlbbshAhgTcrrZDb0WaZ0FcecS/xtmk2g7QsA7QDvKPtmeOgIRIKfeA7bTftNXj6+sbBU1hUWIlHNFQ2GGgkAQOEIEIkCO8KXuoUkOqbni/XFV9lMWmcYiPDL6LTB28STPIHAICESAHMJbOI46/FE147FF/73oEUUW0svIEwSCwLEiEAFyrG/2/ttlMb2vNnnOKj4XKxYIeYLAMSNwmgLkmN/oftvmUKHFdF++cyZkv7VJ6UEgCOwUgQiQncJ7Uplb7/C9iZ+tVtNGXO+e/lVg5AkCx4pAfuDH+mbvv10WzZ05cB7k16r45yhyM28ZeYLAOQKxHBECESBH9DL33BQaCHLvkt1Yf6vqEwFSIOQJAseKQATIsb7Z/bSLAHG1iWksd2O54p1msp/apNQgEAR2ikAEyE7h3X7mC8jRaXS38/5o1dXVJhEgBUSeIHCMCESAHONb3X+b/rSqQIBYVC9rniAQBI4RgQiQY3yr+28TLYQQ+cOqimmtMvIEgaUjkPpPEYgAmSIS97YQIEScSo8A2RaiyScIHBgCESAH9kJSnSAQBILAUhCIAFnKm1p+PdOCIBAEjgyBCJAje6FpThAIAkHgvhCIALkvpFNOEAgCQWBfCOyo3AiQHQGbbINAEAgCx45ABMixv+G0LwgEgSCwIwROWYC8SGH6Vjckn2n9yxX35Ytumqai5lkYAt7xP6s6/8Oi4bnS+hcr9CWL3qPoI4u+suhfFv1Q0RsW5QkCR4vAKQuQV6m3+vFFn1j0OUVfOKHPK7dw9Nxlf9KiNy3i/uQyv6BomuYzyk84KmuehSHgI1ifUHX+lKKbPn+pIr5q0YcVfXDRGxW9TNFLFblQsow8QeA4EThlAWK06KNHvp73wzOv18eRhKPvrXCXBL5Fmdz/uEzuMi48mIhwdCEgjkUg8GpVS3d3vXiZhEkZ1z7/s2J8YNErF+UJAieFwH0IkJMCNI1dNAKfNNSehjk4Yw0CQWCKQATIFJG4TxWBN6iGu36+jPVjipM2snbkXxAIApcRiAC5jEl8Tg8B6xjvOWm2q+jfeeK3PGdqHAR2iEAEyA7BTdaLQeAVqqbPXDQ+dlf9o/JglpEnCASBKQIRIFNE4j5FBF6wGv03i6bPS5cHKiNPEAgCUwQiQKaIXHDHcQII2Gpr/eMjZtr69OX3iKKshRQIeYLAFIEIkCkiu3e/RhXxaTP0JuU397x5ec7Ff9vy/ytFfT5lGud1K2x8/n45PrVojPdx5b6qDzx5hTs4OaYZ7R9e4X+jaHyeqRzOQ4zx2u7AXQWvMG3bqNufqW5PJvCMTB29S9mFjfTI8tvm8xyV2X8schbof5Q5fd6uPKyHlLG1560rp7FN2u79OGf0ehU29zxDedouPKYb7dJWlAuPPMc4bf/QiuVwbBkrZ1bav813EDDQXy+7szEdznR+ioCtoPNnU98WvyO9Y1m4R3rN8hv74VydtP1vV7xNz5NUwHsXjfmOdmFPU+HTZ4wz2m3lFtfUpnNfY9j7VIDfRhmn/Ywv7bSR2H3rnQ35iirmy4ow5V8vE+P4hjIJDwzsp8v+bEXjg5E6Ie2MwrtXQNM/LbsfzY+X+dlF7d+mbagYfAWt/HicZXFausOZfgjfXxHmRth+IL9YYf+8yFqAuiL1lRZ9UIX9q6KXK+pHn8JwCTdxRnr+ioR+oswPKBrD1M1ncAkR9fnNCsekxjjsX1X+H120refLKyP1+YMyCYsyLjz/oFzaVMZWnn9TuWjrN5YJz88qE1bfU6b3OGJZXuvn/er/TxY5Z6Su0qEXLT+YIGn1hfI6f9Rb33GoUZymt6wYT1f0TUXfXNT+bRIWP1j+Hv3sZ8uizh3O1KfUSRkVvH66r75WucQZiRD63PKX9+jP/qXl34OLNy77uk5lCmvS9q8vv6csmj4Ob/58eeoXfmcO9MLHWa5O/zEVrn89dZnjAx+/OQOyjst8vor0ikVuFbDBgl/TR5U/7OamPSvodJ7x5Z9Oq2/WUp0KU5kjTNcP4mY5rVbifl1F9uNg94P8zHL/TtGPFDl/gGGbi/fjYZb3+vmi+v9ORX6sZZw/NA/1eEz5/NUiTPe7yuxHOS9Wjrcv8gN7rjLFeaEy+/H+xZkyTszlv1Qko1TMzQhMXZH6+tpgBa8wjOctyysV9SOOEe67tcdgOrSJYboqxM4n5Q/Bq7+3Wq0+v+g7irSlhcl/Knc/ttq6UmaatsNvYz5jRZYPoeTLiYSsryiW94XH9SQXPO7gUA5h7AodQpTghdWvVV7ekVsN9IFyXnhcrYL50UDgTahLh15niCktpvc2gx9ho+8QToP3+r3REvUHByaZ4+0JcH+JSvDqRepGI1D/Zyn3fyjySEOTxPy5EaaqvF/gmJBB0s+UX/fVsTx99bEVZtSPWVt3kj8t+v+Uv8egRLj03E3a/CXl6KlGQvS3yw2fHyvTQKSMFUHxd8uiv5Zx/qjvp5drejAY3rQO2qK2Eyb/q+J55KXPaz/3yRJgTrbx1zSc4NDp58jI+79dk34M1kFfdvD4/cE+tb5AeXxs0XXPC1cE2oyRYFnXj5HX2nL2j3BwQhrD7h8+LecseG0QEBjD2nH2b8yTF82J2US4tJ05Jwz4T+lR5WF0+rtlejBt5kjiPK48THWUsX6mwhODw/jWgQ/xj9b3K5UeYytjhYkQJuwjqTMGPfrd1k5YGRhgjJjhND2NjFCZ+nvP/TtlYmodZ9qPDCpMW3X4JtMo/Q8r0PRoGesHE15bzv6p43uVnRaLGZd1xfxzloEIxMG50eo6IFpSC4Tpu9eHvrhSY9gtgEwtovI+f5793PbAYkCkrlwYu9+ZQQb3f65/f1o0Pq89Oq6wmyUgzAg20f6k/v27ovG5advHNEdl1yGPqkFbbAwBYYQ/R4+vcv530U0e87uE0BiXcBrdflTjD8ohNtrKGGdq/2vlMR1ZPjHfCqyHuv8tZU5/9OV15UPLuCrCtO1+/BjjVWmE0S5GbYLflH6rPNS5jPNnygQwCu0/j3AHixErTWDUvqyBGLXPZWcOfs7/pn402mbuyvDuaGlG0P07fP3KzF1cZWx8TCFuDKyAm7wHDJfmQ2BWkvWDQa4tZ//kw+8JZ+6HNUwvjX18Lj/vvYW5cP22R/3ciGbAbPrVtpyZBE4PcGjK6CxobRh8rC3X/COMafcdzW9UfdrNfNg+KI9FU3fcRTfiwCuPKWCwYzWn0yT/tQKnndMaRnlvfH6qQoywyjh/5n6gmOJ5hBtavr3iGX2aCjBC92Mqr4d+aEF+iFdlREMiRMY4c+3C4MY4t7Wb6tEua1Fj2u8rhzqUceGx3oDxXvC8hUO7+x3TMv9JpaWZ/lyZwrTRQGNk6hW0Mv1oytO7+BflQQiX8VAPwdCj/M5I+W1vU32ng4UOu605HdzMpTe9OfrP1Wn63v0OHl2J4EPYmfJT7/J6qIc29FAZnELiCJD9vOXpqIobE7lNbf64IktXxsbHRX/XxdmU2CLks1YgbchURy8gMjHeCtrJ82eV61TAltdWH7txzIVbKNaekWxWeJKZ0mgKpkdmgm7kRRCbk78qMu3DQvG42wgTNfVlt5hpJlM8Y32vym9TmEGFkfqmcP7KNbBhvy/6t3coSP+2o09fJWxNgTY++q31vDtku5oOYm6Tx8nEjQA5jFdNePjB3qY2VPPr0vhxodvk23EtVlrI/tbysOD/ZmX+XpHRsPqWdbEPZoMp0yisE01pnEbpRtqyahG2XdLzkAAAEABJREFU3bc1/6gSWHPp6ZVyzj52vBFuYyDGaCr1a8qT1kKY2HXkXZTXrR/95ibv8Lq63rrgHSWwqcLGC4v4tBiL8LAhtO86GIHRjqp7PNlGgOznXU5HuKa4pqr5tmp2lx+CHTg0AdqHdQJzwRZzzb8btW9jimBb7btLPraxYjQWVDHnKfkQFO1tmreF/em5l2mcTW7v+Acq0GKyNR34KsNAoLzPHzutbHrgIY0dYIhgIfics3FHl7y8C/F2RXfpO7uqy6Z89VXC1TdZYGursN1psKHxwXlT2vg/JAIRIA8J4A2Sm/ud/hAxhjEppjF9F3Oj4DHNruymT0xfjfn7QY7uaf3HsIe27zgDi6i2h9oOe1VR4+J6xzONddetm+7bMio2IiaE7HyzUYJGYTcdIdHCpHcREeAO53X51mtMP7X71E042bHXONigYZ2o3X5TqN0xt4xAwN0yoDPZ2Vo7HbFPt4TaSjtlyqaMZrLbuZePZZneuaog01tXhR9ymINs5rftgrqqns7tzC0ge59XpbsqjAbRAsgahMOENiuYq/e+LexL39uW7aIb+wrhMQ5GaCPinyo55Di2HTYwaj+CGrU75pYRiADZMqAz2WFWmMMY5IDe6DYXTwtpv/cty3R7Ynndy0OYTafY7GzpwvUZ1G6mrZVLECowtq36l6vSU6FeXhcea0fjYbcOJGDbfhdzboeXfGgf381SRLiUsZpOa5pOHN8N7UW8U6XpAjlhYXqv8aDlEdrtZjqsygzNInA7zykjuF3qZcc2X+qkre2UduVMW2PkJxy5sgCTd60Ft/lo7mma5ykP4ais58/Xls0BsGYM7tfRuct7pZxenMXUnDw3nSEMYc4WTad7zjFsZxnk41CdOPKVpgkDcoBNmJ1TDmGxd3ibnZ7wcHWDraUdxrTLxUL6u5ZDmBPb6lrO9eP+JvdWmWJRjh9tt2kd4ewfHJWvvLafBZ0bRt3iaJs2szPPI5TFORBlCCvntY/5ce/EKX/lSsuNnIIeM8CU9AlplDOGtR0W0iIYSzMdFIjrwJ7y2JtsRHBgkJZHoPFn9lw+oeUd8Lfwbr2EvclhNqfDTdV4X9MzO64tIVjUH24wgnenZ9J29RVh2sjUN4SNhCEL00b9jF3aMU6nF1d7xdGnxzjs/PVFApB9WqeOI0x6Jkyn5fXvQXqbEsadYvgZbNyEoD8yndmimcgf+Q3zb21POTQ570B4k/cmDIb6svZra4czu71z/EP40RPAj76RGxpIK/i2CnPK2o+5rBceawHCkV06OrXTwtyEgR/vhQTlsDgrHJXzwvMh5TJVYXFPxyQknPWw31xdXMHg9Kv7qcYTxg6b2X3TC6uVzfpxAld614yYJxfHNtB14Nk/8/20GWEYBKbDfhZ8bnR6u3/sXFGHf38e+sCiba5D8QM1d28R2mFLoRiMPJTlwBx8zOsLG8kWVOXTAtw9xD6Gs1sr4E+QYqrs07abBsIkhUlzHVn8906a4WOy3IgwGdNjMPqEMDiMYW03yhWODCS8V0K2w5l+W851aDM7vx+qf29RpA94764v8Q619avLn2DSrp6GMb+vz41TaRid0+EEkcV+61PqUcnXj3eoPGkbP1tb14Fn/zA+B/vgB0vm9HyJd+riSmHaSLCxE/Bn2awNvxP+1mu0l33u98TfbwDe7PrLOoPhH3+/C5oWO0ZPUAxRVgYxwqQnPGzZNXDpOAYE718Oggr2NkqYtiyv80e73EnGQ15ulpi2q/snDPVl7Se8pGlygaX03kP7nZSpo51Ug4fG+sEbOdyEzJc7tIdR3CS+OENRa6stkbYaYmJGN+ZvXZJnZ4+OaWoE42otZZ2o/vmhu4fHKEi+TQSCNH4kOrE4GGOHM5VD+AkjGFxbzi5sJEyHf0+v0DBoU2McozRXOxjxOhCo7vw6jrrYRmnqDU4EQYe1SegpB7O0UM/eYW0SUvwxCCNxdtpIhzONZN3PJKwguvbB5KSbI9thxwwcJCTg5+LO+dHECGaMZhqOkRIIpqfsmnLGhPBwdTx8XBkDR+sgsLGDaBTcdhBh7N7jmDeM3KRs0diVJN5rhxMO8qW5NH4W/zucSWi4vBB+zl4wvT9hI+kDwrTRpgJ225nHOLDl792rP7tBxBiHnT+BjNmz63P8R+Lv6h1rQOww9dsY47g+RJg+770RxPzGOOqkf/3rikDQEsJjOOxtaKjglbwMUKbluDVAGAxpc7YG63djPt6vOAYC8jo5OmUBYvSMEd6EzIdTg/2gbxJfnE2dyahJ+JQImLk0/KdxRzdGYWfP6DdnN4rFcObC2g+j6DrIt/2ZBBscOpydnzCknsKUM00rfCT13YRDx1NX21zbvclU5nU01nOaz/Q8hHYpexpvk1u/uKotwtQPtjASH0bTOnELE3ck9RM2lg9f/h0PnmO4Ngi7CX7yGdPO2dXLAGourP1oTdf9ppyy1/ZOs8mE1aaw9tdmbSScp3WDF3/haJqf3zF/1PltMmEov03h/LVbXidHpyxATu5lp8FBIAgEgW0icFACZJsNS15BIAgEgSCwWwQiQHaLb3IPAkEgCBwtAhEgR/tq07AgcBsEEjcI3B6BCJDbY5YUQSAIBIEgUAhEgBQIeYJAEAgCQeD2CESA3B6zuRTxCwJBIAicHAIRICf3ytPgIBAEgsB2EIgA2Q6OySUIBIF9IZBy94ZABMjeoE/BQSAIBIFlIxABsuz3l9oHgSAQBPaGQATI3qA/lIJTjyAQBILA3RCIALkbbktK5RsGruNeUp3vUlfXd0+/HXGXfG6bxrXnML5tukOMjx/AUZvUT7/hx76JxEHCmYg9dAIIXNc5TgCCo23iB1fLPrvo84pcs83uinTfkyivS49rxcWZo0+q2L6zUMalx/Xec2mmfmNCX4Ubw33xsL/H8KIV0Wdjx/BNTEn//aiKL26309Xqrt4u79nHdx3EnyPfkfBBrNmEgycG64pv30TxUSNlMz+24sx9J6a8V64v7zKlc306/6YRf9/NaH+mjyN12k2m72yI2zSN5zsaHTaa+oN+ATdtcH08E2mX76OM8dvu+x/aIU73L6ZvxXScmNcgsPRgP8CltyH1v4iAbz34fomP8bxDBfk2h49BsfveiK/hlfelxzcNxJkj3wHxAZ5XupRqtcL459JM/VbDn6u4fdVRHB/ukYervkXxxUPMVhji78pxYSP5VoXvRmD64vkolw9y+b7Kt1fE7yqae3xcSPw58p2OX6hEvkNRxsbnYyrEN03eqUzfyYCxD2353oXvpfhORAVdeH6jXL4iqVzpfHzrqcuvn8ZfPr/Unmemb8JIdxW9+FncNgjKMb6vMXbYaH5rOfQLuMFZ3/HdC/Xw8aupYKroK0LeVza1w/dLfHfDdzz0M9+fESd0AghEgBzXSzb6pS34JOsfVNN87MZoGfHz3QKM5rEV5guLZZw/f1K2UbhIg2gLGP5zVvgHFk01ER/jwRx9IthHeSrK+vGlPVNKRra+J7H2PPvn41b9FT2faBW3v9+grO88i8f4qfrXYWVdP4Sk0a+6+TDQC5evuirPp0rZMTQj4un0kg8w/VrF70fcJl+F9DEkOBBiHWc0aTyElm9u+JhXp8VoMX4fhsKsCYsxne9l+HYELJD38bpDBPj/drl9wAhDLuv5ow0+RgZ7H4/qgMaccJdf+zMxdm1lR3BmNsHKlxppUr6P4SuAhMhXVQR+PlHrk7rlvPT4KJZPvRLa+gStRfsJn0uR43G8CESAHNe7NWLsz2saFX//0LzHlN2nU40yfW3N1/HK68KD6VzwKMfPFPVo3lcACanyOn8IIl/d++VznydalOUzuxjcE30v2nxgyAeBRt9NjKvj+KTsy64euDDxJzywrpTnC3XfV26MHSM0Wi7nhceHnS54nDkeWSbm7Xfx3WWXRxnnDyb97meuLyvTyL2M9YP5v2bZtAcz/bSyTx8flyIMjfqFmWYy0mdH8MfMCVHuJkKU5iSs/do0UPjMcvjwURnnDyHlQ0jnHhOL928aTbwvrTCaVxnnj3fyQeXyca0yLjzdBwxGxgACxRcOR7/YjxgBP5Qjbt7JNc20hUbTNGgZ7CNheqaEnqI8TbMYhZb12scIeFMkeWJAm8J/pwJeq2ibjyk1+RlVY67sTRg0hsrt06aPYLkhwcbUjOi0qddnGejVy06zEO8nyk4LKeP8MeJvYXvVWgDtiZYiofWOKSPmP9LrlOOHijY98qIVbQqf8zfVRMvwdcPHVQSCpIzzh/sry/XDRZse04+EtU/uikPDonGyh04AgQiQ43rJmJsWbfrRm2LpkepLVcSnKtr0GEU/ewX6nrbpIAzFFMV09G5UjKFW1I3P728MWa0wsfeocAywCaMur43Pk52FWOs4s14wTAO1h7rfVFBqY+MjjcXlzoc20ov5f1yeps7KuPDQMEzv8LQ4vUkw0AwIKrgRctYq+t1JOyX4EYxT/3Z7J/Js93WmAYHpMPEIkE0aIk0IiTeSBXn+MPJ9cVoQDdSUYmM0xo/9+BBYtygCZA3D0f3DyK5rlO2aV71/C9Q/XZlglOKaLzelgVmV99YejMw0lAXZppe/Ye5z0yvTpPKf+t3FjVk2czRN1YJmzGsUQPxpesw5IkBaYzT1Y9fcXLxd+GlHT0ONgvGmZX15RbRh4DfL7McaGa3s68vjWYrynAACVzGQE2j+0TbR9NRc44zcMQxhtJGrhMGjKpJRbcc3Su61hgra2mPe//UqN+sPTTYClNe1z6bturYWd2LTM1eN3jve1JTmVwfPPy97Cw27xuaYpJF9T5lJ//hKc9VDgNDqxDEtZ1GcfddEe7Borxw7wV6W5RZkfcQ0HE3RRg3rRYSnvmKdbJPmdYsiEnUJCESALOEt3byOdg+JjYnRGthHetNyGBVjbrbLXiVAzLm/d8U32i5jZVswBsG+TbKOQJj9fGXaZG2jnBufZuwEiNH0NKJ687OobseX9nJfR/J65rNIhMUnntnboPHI05z/i7TnYMLW5gVepvbEZ79EZx7yMh0kLuFDMJ0F7dSAh3fPtJvKTjrlTwvlZ2su7WsMe6Ny2Dzxi2XaqEHwv1zZ+7ETre0xjxiBCJDjerm0ht86a9KnljlO35hr98N/0vK37bZHvuU8fzCMc0dZfvSMyliZ6960tVX4XYlQmjKoOeE35m8ra+/UMpXS0zHiPFf9s+5RxsqZDLuq2G9CFs3lJ67FYEyWvekjy9KL9hjmM5W7H+3AbI3oCR+j8w5rUxz28Xf36+Vh6s56SFm3+liH2ZShHWAEt3AHFT+sLHZlwV497dQjQN+k/LnLOH8cMrQFefQ34OgIBgJtj3nECIwd+YibeTJNsyBqV4/dQLaHfku13EIz+saym14w6rXdd7pts4JXL+nfGWE+Fm9NTxipOrjn1LFR9lmUS8bYnzDYSxHOPCwYE2icFvIdKmRvssDfdlpB29u0YGtbq91m1mVsi080ymcAAAegSURBVNVG9HUVycI/hmzL7e+Ve/o469F+DvA5+yCtE/Da/eEV6HR8GRceUz/Wa2g1pm6sY0jXZEqK8PAOfuxCygcOo30Y2VX1wOfBf/W35vTAdfV/g4SOMU7VtV+bynEgsN1TkwC2iwpOwj6g/lnbcD5HexyUtA360eVv+q6M80fezn8QOgYpNkL0zjcCdq7t54ljOR4EdITltSY13oQA4WDrpbl0U0OmeFw5gRy2s93TNAnNYpqHESRmLg9knvtpKhJBYH6bnzMVtmq+QPnPPb9bnuIhU0G2+JbXpcecO21IPEzVCLgFCu3itSuFMORcB62pvM4fjByzfo7ywfDVURuRtmNmBJ0zLBXlwuOcAgEmb2TKyWia1mJE7XwExngh0eCwqcAUjcNzrvlQJnJGBDaEoZH7kGRtFW4diTC2aK68dUD9M4Vl9G+6UHh5zT7vVr40G/VGpo/Ka/aRJ21CPDQezuwEtDNCRp9Rtqk5GxjU1fuwlmENqeO3aZcfIUyIWCezK82AxcDFWZieYuz4MY8UgQiQ43yx5t4tmJtOMZqneXA7jzGdlmkEMA1nH5ps47XQirm2X5uYaKcbzQ5nOi1uhDuGt/17yyJOE6bdmkLv4ukwplF9Jbn0SEO4iEMouYKE27rCpchnHnYLiT8SQYnZGknPMdqzpOcGAeYKE9qR8xTwhbV8Nm2J/YFKTWNQrqlAGJTXhYdgI1ww5QsBZw6CkWCWR9NZ0CVDfToOsw+YTiMSNKaptMVaCBy1Q10Ihml8bgc5CRDaB62VAJdG+wwixAmdAAIRIMf9kk1PmE4wijTCvKq1rtrAMEYSXx6jHzv/ORI20ibGb0pkjDduOzZaxkDHcBrQXHntJ671Dsxb+vafM017iT8Sbeuqkf9cPu1n6gm+cGq/ORP+NBTlEvBzbYIXhj6Xnp86EuryaOI/R+rTcZjcc/FGP9tw4QiP0X+0s1tnIygIUjvNbN64Lo10oSNDIALkyF5omhMEgkAQuC8EIkDuC+mUEwSCQBA4MgQiQO75haa4IBAEgsCxIBABcixvMu0IAkEgCNwzAhEg9wx4igsCQWBfCKTcbSMQAbJtRJNfEAgCQeBEEIgAOZEXnWYGgSAQBLaNQATIthE93vzSsiAQBILABQQiQC7AEUcQCAJBIAjcFIEIkJsilXhBIAgEgX0hcKDlRoAc6ItJtYJAEAgCh45ABMihv6HULwgEgSBwoAhEgBzoi0m1tolA8goCQWAXCESA7ALV5BkEgkAQOAEEIkBO4CWniUEgCASBXSBwEwGyi3KTZxAIAkEgCCwcgQiQhb/AVD8IBIEgsC8EIkD2hXzKDQI3QSBxgsABIxABcsAvJ1ULAkEgCBwyAhEgh/x2UrcgEASCwAEjcOQC5ICRT9WCQBAIAgtHIAJk4S8w1Q8CQSAI7AuBCJB9IZ9yg8CRI5DmHT8CESDH/47TwiAQBILAThCIANkJrMk0CASBIHD8CESAHOo7Tr2CQBAIAgeOQATIgb+gVC8IBIEgcKgIRIAc6ptJvYJAENgXAin3hghEgNwQqEQLAkEgCASBiwhEgFzEI64gEASCQBC4IQIRIDcEKtFujkBiBoEgcBoIRICcxntOK4NAEAgCW0cgAmTrkCbDIBAEgsC+ELjfciNA7hfvlBYEgkAQOBoEIkCO5lWmIUEgCASB+0UgAuR+8U5ph41AahcEgsAtEIgAuQVYiRoEgkAQCAJPRCAC5IlYxBYEgkAQCAK3QGCrAuQW5SZqEAgCQSAILByBCJCFv8BUPwgEgSCwLwQiQPaFfMoNAltFIJkFgftHIALk/jFPiUEgCASBo0AgAuQoXmMaEQSCQBC4fwQiQB5gnv9BIAgEgSBwSwQiQG4JWKIHgSAQBILAAwQiQB7gkP9BIAjsC4GUu1gEIkAW++pS8SAQBILAfhGIANkv/ik9CASBILBYBCJAFvvquuIxg0AQCAL7QSACZD+4p9QgEASCwOIRiABZ/CtMA4JAENgXAqdebgTIqfeAtD8IBIEgcEcEIkDuCFySBYEgEAROHYEIkFPvAftsf8oOAkFg0QhEgCz69aXyQSAIBIH9IRABsj/sU3IQCAJBYF8IbKXcCJCtwJhMgkAQCAKnh0AEyOm987Q4CASBILAVBCJAtgJjMjk1BNLeIBAEVqsIkPSCIBAEgkAQuBMCESB3gi2JgkAQCAJBYD8CJLgHgSAQBILA4hGIAFn8K0wDgkAQCAL7QSACZD+4p9QgsC8EUm4Q2BoCESBbgzIZBYEgEAROC4EIkNN632ltEAgCQWBrCESA3BLKRA8CQSAIBIEHCESAPMAh/4NAEAgCQeCWCESA3BKwRA8CQWBfCKTcQ0MgAuTQ3kjqEwSCQBBYCAIRIAt5UalmEAgCQeDQEIgAObQ3srv6JOcgEASCwFYRiADZKpzJLAgEgSBwOghEgJzOu05Lg0AQ2BcCR1puBMiRvtg0KwgEgSCwawQiQHaNcPIPAkEgCBwpAhEgR/pij6tZaU0QCAKHiEAEyCG+ldQpCASBILAABCJAFvCSUsUgEASCwL4QuKrcCJCr0ElYEAgCQSAIbEQgAmQjNAkIAkEgCASBqxD4/wEAAP///6/jtwAAAAZJREFUAwCGNY08/bI/cwAAAABJRU5ErkJggg==",
    "mapEmbed": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3573.87684397454!2d43.92051649999999!3d26.3951662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x157f57a2469f82ef%3A0x2803b38178f00625!2zSGFybW9ueSBzbWlsZSBjbGluaWNzINi52YrYp9iv2KfYqiDZh9in2LHZhdmI2YbZiiDYs9mF2KfZitmEINmD2YTZitmG2YrZgw!5e0!3m2!1sar!2ssa!4v1773538782924!5m2!1sar!2ssa"
  },
  "hero": {
    "badge": "أخصائي تقويم الأسنان",
    "nameDisplay": "د. محمدهمام",
    "tagline": "السمان",
    "subTitle": "ماجستير سريري في تقويم الأسنان والفكين",
    "desc": "أقدّم لك رعاية تقويمية متخصصة تجمع بين الدقة العلمية والحس الجمالي.",
    "btn1": "احجز موعدك",
    "btn2": "اعرف أكثر",
    "heroMedia": "https://res.cloudinary.com/dwzew575i/image/upload/v1773524151/unnamed_u8sguf_mcjawq.jpg",
    "stat1Num": "+1000",
    "stat1Label": "حالة ناجحة",
    "stat2Num": "+6",
    "stat2Label": "سنوات خبرة",
    "stat3Num": "4.6",
    "stat3Label": "تقييم المرضى"
  },
  "about": {
    "img": "https://res.cloudinary.com/dwzew575i/image/upload/v1773538222/0315-ezgif.com-video-to-webp-converter_2_yyow1f.webp",
    "tag": "عيادات هارموني سمايل",
    "lead": "أؤمن بأن كل ابتسامة قصة فريدة تستحق اهتماماً استثنائياً.",
    "cred1": "الماجستير السريري في تقويم الأسنان",
    "cred2": "عضو الجمعية السعودية لتقويم الأسنان",
    "cred3": "تقنيات تقويم حديثة",
    "cred4": "خبرة أكثر من 6 سنوات",
    "title1": "أخصائي تقويم الأسنان والفكين",
    "title2": "مرخّص في المملكة"
  },
  "social": {
    "instagram": "https://www.instagram.com/dr.homamalsamman",
    "twitter": "",
    "snapchat": "",
    "tiktok": "https://www.tiktok.com/@dr.homamalsamman",
    "facebook": "",
    "youtube": ""
  },
  "doctors": [
    {
      "id": 1,
      "img": "",
      "name": "د. محمدهمام السمان",
      "endTime": "21:00",
      "workDays": [
        0,
        1,
        2,
        3,
        4,
        6
      ],
      "specialty": "تقويم الأسنان والفكين",
      "startTime": "14:00",
      "slotDuration": 30
    }
  ],
  "services": [
    {
      "desc": "الخيار الكلاسيكي الفعّال لتصحيح جميع حالات اعوجاج الأسنان بدقة عالية.",
      "icon": "fa fa-teeth",
      "name": "تقويم معدني"
    },
    {
      "desc": "قوالب شفافة مريحة وغير مرئية لنمط حياة متطلب.",
      "icon": "fa fa-tooth",
      "name": "التقويم الشفاف"
    },
    {
      "desc": "تعديل نمو الفك المتقدم أو المتأخر",
      "icon": "fa fa-child",
      "name": "الأجهزة الوظيفية للأطفال"
    },
    {
      "desc": "رعاية مبكرة توجّه نمو الفك والأسنان في المرحلة الحيوية.",
      "icon": "fa fa-star",
      "name": "الكشف المبكر"
    },
    {
      "desc": "حلول ثابتة ومتحركة تحافظ على نتائج علاجك.",
      "icon": "fa fa-face-smile",
      "name": "المثبتات التقويمية"
    },
    {
      "desc": "رؤية واضحة قبل بدء العلاج — نمذجة رقمية دقيقة.",
      "icon": "fa fa-microscope",
      "name": "التخطيط الرقمي ثلاثي الأبعاد"
    }
  ],
  "gallery": [
    {
      "after": "https://res.cloudinary.com/dwzew575i/image/upload/v1773524551/WhatsApp_Image_2026-03-15_at_12.39.34_AM_lkfkzx.jpg",
      "label": "حالة أسنان أمامية منطمرة",
      "before": "https://res.cloudinary.com/dwzew575i/image/upload/v1773524551/WhatsApp_Image_2026-03-15_at_12.39.34_AM_-_Copy_ecvjsw.jpg"
    },
    {
      "after": "https://res.cloudinary.com/dwzew575i/image/upload/v1773524551/WhatsApp_Image_2026-03-15_at_12.39.48_AM_gg9dky.jpg",
      "label": "حالة تراجع أسنان أمامية",
      "before": "https://res.cloudinary.com/dwzew575i/image/upload/v1773524551/WhatsApp_Image_2026-03-15_at_12.39.48_AM_-_Copy_ywhkba.jpg"
    },
    {
      "after": "https://res.cloudinary.com/dwzew575i/image/upload/v1773524551/WhatsApp_Image_2026-03-15_at_12.40.11_AM_be6i8a.jpg",
      "label": "حالة بروز أسنان أمامية",
      "before": "https://res.cloudinary.com/dwzew575i/image/upload/v1773524552/WhatsApp_Image_2026-03-15_at_12.40.11_AM_-_Copy_ovyvje.jpg"
    }
  ],
  "reviews": [
    {
      "date": "منذ أسبوعين",
      "name": "reem saif",
      "text": "تجربة تقويم الأسنان مع دكتور محمد همام ٥ نجمات ولو اقدر اكثر حطيت\nبصراحة كنت متخوفة اول ما ركبت التقويم بس الحمد لله الدكتور عنده ضمة وضمير بشغله وكل جلسة اشوف تحسن وفرق كبير ما شاء الله\n",
      "rating": 5,
      "initial": "R"
    },
    {
      "date": "قبل 9 أشهر",
      "name": "   Ghaid Re",
      "text": "تجربة تقويم الأسنان مع دكتور محمد همام اكثر من ممتازة من ناحية التشخيص والعلاج المطلوب. وتجربة تنظيف الأسنان باحترافية وبخفة اليد مع دكتور همام ريحاوي، نخبة من الأطباء في القصيم\n",
      "rating": 4,
      "initial": "G"
    },
    {
      "date": "قبل 8 أشهر",
      "name": "   Ghaida Al-harbi",
      "text": "افضل دكتور محمد همام عنده ذمه وضمير بشغله وصراحه النتيجة فوق الخيال وانا لسا مافكيته احسن دكتور بالدنيااااا\n",
      "rating": 5,
      "initial": "G"
    }
  ],
  "hoursOverride": [
    {
      "day": "الأحد",
      "time": "14:00 - 21:00",
      "closed": false
    },
    {
      "day": "الاثنين",
      "time": "14:00 - 21:00",
      "closed": false
    },
    {
      "day": "الثلاثاء",
      "time": "14:00 - 21:00",
      "closed": false
    },
    {
      "day": "الأربعاء",
      "time": "14:00 - 21:00",
      "closed": false
    },
    {
      "day": "الخميس",
      "time": "14:00 - 21:00",
      "closed": false
    },
    {
      "day": "الجمعة",
      "time": "09:00 - 13:00",
      "closed": true
    },
    {
      "day": "السبت",
      "time": "14:00 - 21:00",
      "closed": false
    }
  ]
};

  function hdrs(extra){
    return Object.assign({
      'Content-Type':'application/json',
      'apikey':SUPABASE_KEY,
      'Authorization':'Bearer '+SUPABASE_KEY,
      'Prefer':'return=representation',
    }, extra);
  }

  function deepMerge(def,saved){
    const res=JSON.parse(JSON.stringify(def));
    if(!saved||typeof saved!=="object")return res;
    Object.keys(saved).forEach(k=>{
      if(saved[k]!==null&&typeof saved[k]==="object"&&!Array.isArray(saved[k])&&res[k]&&typeof res[k]==="object")
        res[k]={...res[k],...saved[k]};
      else res[k]=saved[k];
    });
    return res;
  }

  async function read(){
    const now=Date.now();
    if(_cache&&now-_lastFetch<TTL)return _cache;
    try{
      const r=await fetch(API+"?key=eq."+ROW_KEY+"&select=value",{headers:hdrs()});
      if(!r.ok)throw new Error("fetch "+r.status);
      const rows=await r.json();
      if(!rows.length){
        await fetch(API,{method:"POST",headers:hdrs(),body:JSON.stringify({key:ROW_KEY,value:DEFAULTS})});
        _cache=JSON.parse(JSON.stringify(DEFAULTS));
      }else{
        _cache=deepMerge(DEFAULTS,rows[0].value);
      }
      _lastFetch=now;return _cache;
    }catch(e){
      console.warn("DB read error:",e.message);
      return _cache||JSON.parse(JSON.stringify(DEFAULTS));
    }
  }

  async function write(data){
    const r=await fetch(API+"?key=eq."+ROW_KEY,{method:"PATCH",headers:hdrs(),body:JSON.stringify({value:data})});
    if(!r.ok){
      const r2=await fetch(API,{method:"POST",headers:hdrs(),body:JSON.stringify({key:ROW_KEY,value:data})});
      if(!r2.ok)throw new Error("write failed: "+r2.status);
    }
    _cache=JSON.parse(JSON.stringify(data));_lastFetch=Date.now();
    return true;
  }

  function getConfig(){return{url:SUPABASE_URL};}
  function isReady(){return true;}
  return{read,write,getConfig,isReady,DEFAULTS};
})();